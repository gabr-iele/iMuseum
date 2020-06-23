#ifndef MQTT_H
#define MQTT_H

#include "net/emcute.h"
#include "net/ipv6/addr.h"

#define EMCUTE_PORT         (1883U)
#define EMCUTE_ID           ("iMuseum_board")
#define EMCUTE_PRIO         (THREAD_PRIORITY_MAIN - 2)

#define NUMOFSUBS           (16U)
#define TOPIC_MAXLEN        (64U)

extern emcute_sub_t subscriptions[NUMOFSUBS];

int mqtt_connect(char* addr, int port);

int mqtt_disconnect(void);

int mqtt_publish(char* topic, char* data, int qos, int retain);

int mqtt_subscribe(char* topic, int qos, emcute_cb_t on_pub);

int mqtt_unsubscribe(char* topic);

int mqtt_last_will(char* topic, char* message);

#endif
