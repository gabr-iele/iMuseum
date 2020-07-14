import paho.mqtt.client as mqtt
import requests
import sys
import json

PUT_SENSOR_URL = "https://europe-west1-iot2020-def28.cloudfunctions.net/putSensor"
ALIVE_TOPIC = "alive"
GW_ADDR = sys.argv[1]
BROKER_PORT = 1886


def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    mqttcl.subscribe(ALIVE_TOPIC)

def on_message(client, userdata, msg):
    print("Message received")
    payload = json.loads(msg.payload)   # {"id", "timestamp"}
    ts_ms = str(int(payload["timestamp"]) / 1000)   # timestamp in msecs
    msg = {
        payload["id"]: {
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
