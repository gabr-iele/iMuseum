#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#include "shell.h"
#include "xtimer.h"
#include "msg.h"
#include "thread.h"
#include "periph/rtc.h"
#include "shell.h"
#include "fmt.h"

#include "mqtt.h"
#include "beacon.h"

#include "net/sntp.h"
#include "net/ntp_packet.h"
#include "net/af.h"
#include "net/ipv6/addr.h"
#include "jsmn.h"

#define BROKER_PORT (1885U)
#define OPENING_HOURS_TOPIC ("opening_hours")
#define ALIVE_TOPIC ("alive")
#define ALIVE_PERIOD (5)

#define STOP_MSG (1)

static char emcute_stack[THREAD_STACKSIZE_DEFAULT];
static char mqtt_stack[THREAD_STACKSIZE_DEFAULT];

kernel_pid_t emcute_pid;
kernel_pid_t mqtt_pid;

struct tm open_hour;
struct tm close_hour;


/* Emcute thread. */
static void *emcute_thread(void *arg) {
    (void)arg;
    emcute_run(EMCUTE_PORT, EMCUTE_ID);

    return NULL;
}

static void close_cb(void *arg);
static void open_cb(void *arg);

static void close_cb(void *arg) {
    (void)arg;

    puts("closing");
    stop_beacon();
    msg_t msg;
    msg.content.value = STOP_MSG;
    msg_send(&msg, mqtt_pid);

    close_hour.tm_mday += 1;
    rtc_tm_normalize(&close_hour);

    //start open hour alarm
    rtc_set_alarm(&open_hour, open_cb, NULL);
}

static void open_cb(void *arg) {
    (void)arg;

    puts("opening");
    start_beacon();
    thread_wakeup(mqtt_pid);
    open_hour.tm_mday += 1;
    rtc_tm_normalize(&open_hour);

    //start open hour alarm
    rtc_set_alarm(&close_hour, close_cb, NULL);
}

static int jsoneq(const char *json, jsmntok_t *tok, const char *s) {
    if (tok->type == JSMN_STRING && (int) strlen(s) == tok->end - tok->start &&
        strncmp(json + tok->start, s, tok->end - tok->start) == 0) {
        return 0;
    }
    return -1;
}

static void on_pub(const emcute_topic_t *topic, void *data, size_t len) {
    char *in = (char *)data;

    printf("### got publication for topic '%s' [%i] ###\n",
           topic->name, (int)topic->id);
    printf("%s\n", in);


    rtc_clear_alarm();

    //initialize open/close hour with current hour
    rtc_get_time(&close_hour);
    rtc_get_time(&open_hour);




    jsmn_parser p;
    jsmntok_t t[128]; /* We expect no more than 128 JSON tokens */

    jsmn_init(&p);
    int r = jsmn_parse(&p, in, len, t, 128);
    if (r < 0) {
        printf("Failed to parse JSON: %d\n", r);
        return;
    }

    char buf[16];

    /* Loop over all keys of the root object */
    for (int i = 1; i < r; i++) {
        if (jsoneq(in, &t[i], "close") == 0) {
            for(; i < r; i++) {
                if (jsoneq(in, &t[i], "hour") == 0) {
                    i++;
                    sprintf(buf, "%.*s", t[i].end - t[i].start, in + t[i].start);
                    close_hour.tm_hour = atoi(buf);
                } else if (jsoneq(in, &t[i], "min") == 0) {
                    i++;
                    sprintf(buf, "%.*s", t[i].end - t[i].start, in + t[i].start);
                    close_hour.tm_min = atoi(buf);
                } else if (jsoneq(in, &t[i], "sec") == 0) {
                    i++;
                    sprintf(buf, "%.*s", t[i].end - t[i].start, in + t[i].start);
                    close_hour.tm_sec = atoi(buf);
                    break;
                }
            }
        }
        else if (jsoneq(in, &t[i], "open") == 0) {
            for(; i < r; i++) {
                if (jsoneq(in, &t[i], "hour") == 0) {
                    i++;
                    sprintf(buf, "%.*s", t[i].end - t[i].start, in + t[i].start);
                    open_hour.tm_hour = atoi(buf);
                } else if (jsoneq(in, &t[i], "min") == 0) {
                    i++;
                    sprintf(buf, "%.*s", t[i].end - t[i].start, in + t[i].start);
                    open_hour.tm_min = atoi(buf);
                } else if (jsoneq(in, &t[i], "sec") == 0) {
                    i++;
                    sprintf(buf, "%.*s", t[i].end - t[i].start, in + t[i].start);
                    open_hour.tm_sec = atoi(buf);
                    break;
                }
            }
        }
    }



    //set close hour
    rtc_tm_normalize(&close_hour);

    printf("%d/%d/%d %d:%d:%d\n", close_hour.tm_mday, close_hour.tm_mon,
    close_hour.tm_year+1900, close_hour.tm_hour, close_hour.tm_min, close_hour.tm_sec);


    //set open hour
    open_hour.tm_mday += 1;
    rtc_tm_normalize(&open_hour);

    printf("%d/%d/%d %d:%d:%d\n", open_hour.tm_mday, open_hour.tm_mon,
    open_hour.tm_year+1900, open_hour.tm_hour, open_hour.tm_min, open_hour.tm_sec);

    //start close hour alarm
    rtc_set_alarm(&close_hour, close_cb, NULL);
}

/* Mqtt thread. */
static void *mqtt_thread(void *arg) {
    msg_t msg;
    msg_t msg_queue[8];
    msg_init_queue(msg_queue, 8);

    /* initialize our subscription buffers */
    memset(subscriptions, 0, (NUMOFSUBS * sizeof(emcute_sub_t)));

    /* start the emcute thread */
    emcute_pid = thread_create(emcute_stack, sizeof(emcute_stack), EMCUTE_PRIO, 0,
                               emcute_thread, NULL, "emcute");

    //mqtt connect
    mqtt_connect((char*) arg, BROKER_PORT);

    //mqtt subscribe orario apertura/chiusura
    mqtt_subscribe(OPENING_HOURS_TOPIC, 0, on_pub);

    //publish hello every ALIVE_PERIOD seconds
    char topic[64];
    sprintf(topic, "%s/%d", ALIVE_TOPIC, 0);

    char data[128];

    while(1) {
        puts("while");

        //print current time
        struct tm time;
        rtc_get_time(&time);

        printf("%d/%d/%d %d:%d:%d\n", time.tm_mday, time.tm_mon,
        time.tm_year+1900, time.tm_hour, time.tm_min, time.tm_sec);

        msg_try_receive(&msg);
        if(msg.content.value == STOP_MSG) thread_sleep();
        char timestamp[20];
        timestamp[fmt_u64_dec(timestamp, sntp_get_unix_usec())] = '\0';
        sprintf(data, "hello %s", timestamp);
        mqtt_publish(topic, data, 0, 1);
        xtimer_sleep(ALIVE_PERIOD);
    }

    return NULL;
}


static int cmd_start(int argc, char **argv){
    if (argc < 2) {
        printf("usage: %s <broker addr>\n", argv[0]);
        return 1;
    }

    sock_udp_ep_t time_server = { .family = AF_INET6,
                                  .netif = SOCK_ADDR_ANY_NETIF,
                                  .port = NTP_PORT };

    ipv6_addr_t *addr = (ipv6_addr_t *)&time_server.addr;
    ipv6_addr_from_str(addr, argv[1]);

    if (sntp_sync(&time_server, 1000000) < 0) {
        puts("Error in time synchronization");
        return 1;
    }

    struct tm *tm;
    time_t time = (time_t)(sntp_get_unix_usec() / US_PER_SEC);

    tm = gmtime(&time);
    rtc_set_time(tm);

    //print current time
    printf("%d/%d/%d %d:%d:%d\n", tm->tm_mday, tm->tm_mon,
    tm->tm_year+1900, tm->tm_hour, tm->tm_min, tm->tm_sec);


    start_beacon();

    //start mqtt
    mqtt_pid = thread_create(mqtt_stack, sizeof(mqtt_stack), EMCUTE_PRIO+1, 0,
                             mqtt_thread, (void*) argv[1], "mqtt");

    return 0;
}

static const shell_command_t shell_commands[] = {
    { "start", "", cmd_start },
    { NULL, NULL, NULL }
};

//only for testing in native
//extern int _gnrc_netif_config(int argc, char **argv);


static msg_t queue[8];

int main(void) {
    //only for testing in native
    //char *arg[] = {"ifconfig", "5", "add", "fec0:affe::99"};
    //_gnrc_netif_config(4, arg);

    /* the main thread needs a msg queue to be able to run `ping6`*/
    msg_init_queue(queue, (sizeof(queue) / sizeof(msg_t)));


    /* start shell */
    char line_buf[SHELL_DEFAULT_BUFSIZE];
    shell_run(shell_commands, line_buf, SHELL_DEFAULT_BUFSIZE);


    /* should be never reached */
    return 0;
}
