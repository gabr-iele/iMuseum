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

#define BROKER_PORT             (1885U)
#define OPENING_HOURS_TOPIC     ("opening_hours")
#define ALIVE_TOPIC             ("alive")
#define ALIVE_PERIOD            (5)

#define STOP_MSG                (1)

static char emcute_stack[THREAD_STACKSIZE_DEFAULT];
static char mqtt_stack[THREAD_STACKSIZE_DEFAULT];

kernel_pid_t emcute_pid;
kernel_pid_t mqtt_pid;

struct tm open_hour;
struct tm close_hour;


/* Emcute thread */
static void *emcute_thread(void *arg) {
    (void)arg;
    emcute_run(EMCUTE_PORT, EMCUTE_ID);

    return NULL;
}

static void close_cb(void *arg);
static void open_cb(void *arg);

/* Close hour alarm callback */
static void close_cb(void *arg) {
    (void)arg;

    puts("closing");
    
    /* Stop beacon */
    stop_beacon();

    /* Stop mqtt */
    msg_t msg;
    msg.content.value = STOP_MSG;
    msg_send(&msg, mqtt_pid);

    /* Update close hour alarm */
    close_hour.tm_mday += 1;
    rtc_tm_normalize(&close_hour);

    /* Start open hour alarm */
    rtc_set_alarm(&open_hour, open_cb, NULL);
}

/* Open hour alarm callback */
static void open_cb(void *arg) {
    (void)arg;

    puts("opening");

    /* Start beacon */
    start_beacon();

    /* Start mqtt */
    thread_wakeup(mqtt_pid);

    /* Update open hour alarm */
    open_hour.tm_mday += 1;
    rtc_tm_normalize(&open_hour);

    /* Start close hour alarm */
    rtc_set_alarm(&close_hour, close_cb, NULL);
}

static int jsoneq(const char *json, jsmntok_t *tok, const char *s) {
    if (tok->type == JSMN_STRING && (int) strlen(s) == tok->end - tok->start &&
        strncmp(json + tok->start, s, tok->end - tok->start) == 0) {
        return 0;
    }
    return -1;
}

/* Opening hours on publish callback */
static void on_pub(const emcute_topic_t *topic, void *data, size_t len) {
    char *in = (char *)data;

    /* Print message */
    printf("### got publication for topic '%s' [%i] ###\n",
           topic->name, (int)topic->id);
    printf("%s\n", in);

    /* Clear cyrrent alarm */
    rtc_clear_alarm();

    /* initialize open/close hour with current hour */
    rtc_get_time(&close_hour);
    rtc_get_time(&open_hour);

    /* Parse message */
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


    /* Set close hour */
    rtc_tm_normalize(&close_hour);
    printf("%d/%d/%d %d:%d:%d\n", close_hour.tm_mday, close_hour.tm_mon,
    close_hour.tm_year+1900, close_hour.tm_hour, close_hour.tm_min, close_hour.tm_sec);


    /* Set open hour */
    open_hour.tm_mday += 1;
    rtc_tm_normalize(&open_hour);
    printf("%d/%d/%d %d:%d:%d\n", open_hour.tm_mday, open_hour.tm_mon,
    open_hour.tm_year+1900, open_hour.tm_hour, open_hour.tm_min, open_hour.tm_sec);

    /* start close hour alarm */
    rtc_set_alarm(&close_hour, close_cb, NULL);
}

/* Mqtt thread */
static void *mqtt_thread(void *arg) {
    char** args = (char**) arg;
    char* addr = args[1];
    char* id = args[2];
    
    /* Initialize IPC message queue */
    msg_t msg;
    msg_t msg_queue[8];
    msg_init_queue(msg_queue, 8);

    /* Initialize our subscription buffers */
    memset(subscriptions, 0, (NUMOFSUBS * sizeof(emcute_sub_t)));

    /* Start the emcute thread */
    emcute_pid = thread_create(emcute_stack, sizeof(emcute_stack), EMCUTE_PRIO, 0,
                               emcute_thread, NULL, "emcute");

    /* Connect to broker */
    mqtt_connect(addr, BROKER_PORT);

    /* Subscribe to opening hours topic */
    mqtt_subscribe(OPENING_HOURS_TOPIC, 0, on_pub);

    /* Publish message every ALIVE_PERIOD seconds to the topic ALIVE_TOPIC */
    char data[128];

    while(1) {
        /* Print current time */
        struct tm time;
        rtc_get_time(&time);
        printf("%d/%d/%d %d:%d:%d\n", time.tm_mday, time.tm_mon,
        time.tm_year+1900, time.tm_hour, time.tm_min, time.tm_sec);

        /* If it receives a STOP_MSG it stops publishing and goes to sleep */
        msg_try_receive(&msg);
        if(msg.content.value == STOP_MSG) thread_sleep();

        char timestamp[20];
        timestamp[fmt_u64_dec(timestamp, sntp_get_unix_usec())] = '\0';
        sprintf(data, "{\"id\": \"%s\", \"timestamp\": \"%s\"}", id, timestamp);
        mqtt_publish(ALIVE_TOPIC, data, 0, 1);
        xtimer_sleep(ALIVE_PERIOD);
    }

    return NULL;
}


static int cmd_start(int argc, char **argv){
    /* Check arguments */
    if (argc < 3) {
        printf("usage: %s <broker addr> <board id>\n", argv[0]);
        return 1;
    }

    /* Syncronize time */
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

    /* Print current time */
    printf("%d/%d/%d %d:%d:%d\n", tm->tm_mday, tm->tm_mon,
    tm->tm_year+1900, tm->tm_hour, tm->tm_min, tm->tm_sec);

    /* Start broadcasting beacon */
    start_beacon();

    /* Start mqtt thread */
    mqtt_pid = thread_create(mqtt_stack, sizeof(mqtt_stack), EMCUTE_PRIO+1, 0,
                             mqtt_thread, (void*) argv, "mqtt");

    return 0;
}

static const shell_command_t shell_commands[] = {
    { "start", "", cmd_start },
    { NULL, NULL, NULL }
};

static msg_t queue[8];

int main(void) {
    /* The main thread needs a msg queue to be able to run `ping6`*/
    msg_init_queue(queue, (sizeof(queue) / sizeof(msg_t)));

    /* Start shell */
    char line_buf[SHELL_DEFAULT_BUFSIZE];
    shell_run(shell_commands, line_buf, SHELL_DEFAULT_BUFSIZE);

    /* Should be never reached */
    return 0;
}
