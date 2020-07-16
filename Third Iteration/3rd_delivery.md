# 3rd Delivery

This document aims to summarize the changes made on the project (architecture, design and evaluation aspects) since the second delivery. In particular, it provides the technical work which has been completed, the functionalities which have been implemented, the ones that are still missing and the evaluation done on the realized artifact.

## Comments 
Concerns have been expressed about the lack of features of the system and the waste of data coming from the visits, now the system's focus is on data analytics rather than simply providing information to the user from the sensors (more of that in the Mobile app and Web app section). 

## What has changed

- [Architecture] Due to RIOT OS not supporting the multiprotocol mode (BLE + 802.15.4) of the nrf52840dk board the architecture has been changed to use only BLE for both the communication between the boards and with the smartphone
- [Architecture] Since 802.15.4 support it's not needed anymore the board used has been changed from the nrf52840dk to the nrf52dk
- [Architecture] The Eclipse Ponte bridge has been substituted with an MQTT to REST bridge developed by ourself to have finer control over its inner working


## Technical work

- **Sensor network**:
  The firmware for the IOT boards and the MQTT to RESt bridge has been fully developed. 
  Once started the boards synchronize their time using the sntp protocol and then start broadcasting their identifier over Bluetooth in order for the mobile app to recognize the art piece. Meanwhile they regularly publish a timestamp, that will then be used to check that the board is alive, over an MQTT topic. The boards are also subscribed to another topic where the opening hours are published. RTC alarms are used to put the boards to sleep when the museum closes and wake up when it opens.
  There is one IPv6 gateway board per museum, running the GNRC border router firmware. It is connected over USB to a Linux computer, itself connected to the internet. The ethos protocol (ethernet over serial) is used for the uplink connection and IPv6 over BLE for downlink.
  The role of the gateway board is to allow the other boards to communicate with the Linux computer, where the RSMB MQTT/MQTT-SN broker runs.
  On this machine runs also the MQTT to REST bridge allowing the messages from the boards to reach the cloud infrastructure.
  <br/>

- **Mobile app**:
  The mobile application starts detecting BLE packets from the moment it detects a museum compatible with the application (if the user is close enough to a museum using subscribed to the service, it will show a notification to the user that will start a visit).
  
  Once the application detects a valid sensor ID, it will send it to the cloud infrastructure (along with the ID of the visit) and respond with all the data of the piece where the sensor is placed on. 
  
  The cloud infrastructure memorizes the transit of the user to compute useful statistics about the path taken inside the museum and how frequently a piece is visited.
  <br/>

- **Web app**:
  From the feedback received, much bigger importance was given to data analytics and crowdsensing. Specifically: now the cloud infrastructure uses a model to compute how crowded a piece inside a museum can be, based on data received from all the visits that took place in the museum. All the visits also provide data about the exact path that visitors took inside the museum in the form of a Graph (showing any loops or not from the start to the visit to the end).
    
  
## Still to do / System evolution

- Introduce the battery level in the alive message sent by the boards to the backend: right now, the only information received by the backend is the timestamp, used to check whether the board has been recently alive or much time has passed and therefore it has probably gone down. It may be useful to monitor the battery level of the boards, in order to check the energy consumption and be ready to replace it.

- Study and implement an ML model to compute the attendance level of a statue (opposed to the current one based upon thresholds).

 - Improve the UI of the bridge and of the boards firmware so that no technical knowledge is needed to run them.


## Evaluation done

### Latency

For the beacon liveness notifications, the only interesting aspect is communication over MQTT to the local bridge. We can't still carry an extremely precise evaluation, since we would need information about the size of the museum, in order to know whether could be useful to add more gateways and bridges to avoid congestions and increase the quality of service. By testing the system on iotlab with few boards, we reach a very good level of latency for the messages arriving to our gateway board.

For the communication from the gateway to the backend, as well the communication mobile-backend (in both directions), they are entrusted to the Firebase REST APIs. In this case, we have sometimes experienced short delays, depending by the network infrastructure, but still acceptable ones, not compromising the quality of an eventual visit.


### Cloud infrastracture costs

We chose to employ Firebase as cloud backend in our final infrastructure. Given the work done at the time of the compilation of this document, the following costs have been taken into account:

  - Authentication: **$0.06/verification**
  - Storage: **$0.026/GB**
  - Realtime database: **$5/GB**
  - Functions invocation: **$0.40/million**
  - Hosting: **$0.026/GB**

Given an estimation of the visitors per year and the number of pieces of the museum, a total cost can be computed by taking into account the number of interactions that need to be processed. Using the example of the Sapienza Museum, dealing with a hypothetic average number of 200 visitors per day, a number of pieces of about 1200 and an optimistic opening time of 300 days/year, can be computed:
  - Less than **$5/year** for the realtime database, dealing with the storing of beacons rilevations;
  - 300 * 1200 * 200 = 72 million function invocations, corresponging to about **$30/year** (notice that this is a borderline scenario, hypothizing all users interacting with all the pieces in the museum);
  - A not excessive cost for the storage service, containing the info sent to users regarding the pieces (either text and pictures): this cost estimation is strictly linked to the characteristics of the museum (number of pieces, amount and type of information, quality of the same, and so on);
  - Negligible cost for the dashboard authentication
  - Negligible cost for the dashboard hosting

It is interesting to look at how the overall cloud costs evaluation highly depends on the type of museum: its dimension, how many pieces it exposes, the number of days it is open, etc. In particular, it is notable that statistics on the flow of visitors inside the museum highly affects the expected cost.

N.B. From the perspective of a real deployment scenario, the Pay-As-You-Go plan for Firebase has been employed to compute the costs, looking at the case of long-term usage of the application.

### Beacons efficiency

We chose to use nRF52DK boards, one for each piece, since they support both BLE advertising (the part strictly regarding beacons) and MQTT, which is needed for the communication related to the open/closure hours of the museum. We are interested in the following aspects:

- *Scope*: by configuring the output power of the board, a range of 3-4 meters can be reached, which is considered acceptable for the Sapienza Museum.
- *Cost*: the cost of a single board floats around 30$; in this case, the evaluation highly depends on the number of pieces in the museum and the type of placement which can be adopted for the boards.


### User experience

From the Mobile Application and Web App testers, we managed to extract some common comments that are:

- The application is really simple to use: no registration needed wich is good (because generally speaking, privacy is a big concern).

-  The application automatically detects museums using the user's position, so no need to choose them from a list, but the application does not work without it: even if the system clearly explain why it needs the position, some users still don't feel confident about giving that information.

- The Web app interface is simple enough and easy to use, but the crowdsensing it's a little bit confusing without any tutorial, also providing the password every time can be annoying. 


### Evaluation: what is missing

- We couldn't find a way to exactly estimate the energy consumption/liveness of a board, but we reduced it to the minimal amount making the boards work only during opening hours. More deep analysis should be carried in the future to check whether the activity of the boards exceeds an acceptable limit of battery consumption.

- In the scenario of putting one board on each piece, a museum with very much pieces could find it too expensive; therefore, the cost evaluation could take into account the possibility of putting fewer boards (e.g. one for each room) and see how it affects the other metrics (still taking into account how many pieces the museum exposes).


