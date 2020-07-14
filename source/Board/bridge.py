import paho.mqtt.client as mqtt
import requests
import sys
import json
import uuid

PUT_SENSOR_URL = "https://europe-west1-iot2020-def28.cloudfunctions.net/putSensor"
GET_HOURS_URL = "https://europe-west1-iot2020-def28.cloudfunctions.net/getMuseumHoursFromID/3a1e0ca8-0d61-4d79-8652-cd92eabb0547"
ALIVE_TOPIC = "alive"
HOURS_TOPIC = "opening_hours"
GW_ADDR = sys.argv[1]
BROKER_PORT = 1886


def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    mqttcl.subscribe(ALIVE_TOPIC)
    res = requests.get(GET_HOURS_URL)
    data_json = json.loads(res.txt)["data"]
    mqttcl.publish(HOURS_TOPIC, json.dumps(data_json))

def on_message(client, userdata, msg):
    print("Message received")
    payload = json.loads(msg.payload)   # {"id", "timestamp"}
    ts_ms = int(payload["timestamp"]) / 1000000   # timestamp in secs
    id = {
        "uuid": str(uuid.UUID(payload["id"]))
    }
    msg = {
        id["uuid"]: {
            "battery": 100,   # TODO: retrieve battery (if possible)
            "lastTimestamp": ts_ms
        }
    }
    print("Sending to the backend..")
    # call REST API
    response = requests.put(PUT_SENSOR_URL, json=msg)
    # print response
    print(response.content)

def on_disconnect(client, userdata, rc):
    print("\nDisconnected")

mqttcl = mqtt.Client("Bridge")
mqttcl.on_connect = on_connect
mqttcl.on_message = on_message
mqttcl.on_disconnect = on_disconnect

mqttcl.connect(GW_ADDR,BROKER_PORT)
try:
    mqttcl.loop_forever()
except KeyboardInterrupt:
    print("\nStopping bridge..")
mqttcl.disconnect()
