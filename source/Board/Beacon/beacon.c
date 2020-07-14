#include "nimble_riot.h"
#include "host/ble_hs.h"
#include "host/ble_gap.h"
#include "beacon.h"

static void ble_app_set_addr(void) {
    ble_addr_t addr;
    int rc;

    rc = ble_hs_id_gen_rnd(1, &addr);
    assert(rc == 0);

    rc = ble_hs_id_set_rnd(addr.val);
    assert(rc == 0);
}

static void ble_app_advertise(uint8_t *uuid) {
    struct ble_gap_adv_params adv_params;
    int rc;

    rc = ble_ibeacon_set_adv_data(uuid, 0, 0, 0);
    assert(rc == 0);

    /* Begin advertising. */
    adv_params = (struct ble_gap_adv_params){ 0 };
    rc = ble_gap_adv_start(BLE_OWN_ADDR_RANDOM, NULL, BLE_HS_FOREVER,
                           &adv_params, NULL, NULL);
    assert(rc == 0);
}

void start_beacon(uint8_t *uuid) {
    ble_app_set_addr();
    ble_app_advertise(uuid);
    puts("beacon started");
}

void stop_beacon(void) {
    ble_gap_adv_stop();
    puts("beacon stopped");
}
