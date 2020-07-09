import paho.mqtt.client as mqtt
import requests
import sys

firebase_url = "https://europe-west1-iot2020-def28.cloudfunctions.net/putSensor"
ALIVE_TOPIC = "alive/0"
GW_ADDR = sys.argv[1]
BROKER_PORT = 1886


def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    mqttcl.subscribe(ALIVE_TOPIC)

def on_message(client, userdata, msg):
    # retrieve payload
    ## TODO: extract board id from msg
    ## bid = ...
    # do PUT to firebase
    print("Message received")
    msg = {
        "{bid}": {
           "status": "On",
           "battery": 100   # TODO: retrieve battery (if possible)
       }
    }
    print("Sending to the backend..")
    # call REST API
    response = requests.put(firebase_url, data=msg)
    # print response
    print(response.content)

def on_disconnect(client, userdata, rc):
    print("\nDisconnected")

mqttcl = mqtt.Client()
mqttcl.on_connect = on_connect
mqttcl.on_message = on_message
mqttcl.on_disconnect = on_disconnect

mqttcl.connect(GW_ADDR,BROKER_PORT)
try:
    mqttcl.loop_forever()
except KeyboardInterrupt:
    print("\nStopping bridge..")
mqttcl.disconnect()