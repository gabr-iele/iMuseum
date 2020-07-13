# 3rd Delivery

This document aims to summarize the changes made on the project (architecture, design and evaluation aspects) since the second delivery. In particular, it provides the technical work which has been completed, the functionalities which have been implemented, the ones that are still missing and the evaluation done on the realized artifact.

## What has changed

- [Architecture] /* TODO: insert BLE between board */
- [Architecture] /* TODO: remove PONTE infame and add mqtt bridge calling rest api */


## Technical work

- Low level architecture

  */ TODO: describe inter-board RIOT architecture, iotlab, how boards advertise over BLE and how they notify over mqtt (bridge) to the backend */
  
- Mobile app

  */ TODO: describe how the app detects BLE packets from the boards, how talks with backend */
  
- Web app

  */ TODO: describe added functionalities about visits */
  
  
  
## Still to do

- Introduce the battery level in the alive message sent by the boards to the backend: right now, the only information received by the backend is the timestamp, used to check whether the board has been recently alive or much time has passed and therefore it has probably gone down. It may be useful to monitor the battery level of the boards, in order to check the energy consumption and be ready to replace it.
- Heatmaps /* TODO */
- Add other useful informations for curators (?) */ TODO */


## Evaluation done

### Latency

For the beacon liveness notifications, the only interesting aspect is the communication over MQTT to the local bridge. We can't still carry an extremely precise evaluation, since we would need informations about the size of the museum, in order to know whether could be useful to add more gateways and bridges to avoid congestions and increase the quality of service. By testing the system on iotlab with few boards, we reach a very good level of latency for the messages arriving to our gateway board.

For the communication from the gateway to the backend, as well the communication mobile-backend (in both directions), they are entrusted to the Firebase REST APIs. In this case we have sometime experienced short delays, depending by the network infrastructure, but still acceptale ones, not compromising the quality of an eventual visit.


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
- *Cost*: the cost of a single board floats around 30$; in this case, the evaluation highly depends by the number of pieces in the museum and the type of placement which can be adopted for the boards.


### User experience

/* TODO */



### Evaluation: what is missing

- We couldn't find a way to exactly estimate the energy consumption/liveness of a board, but we reduced it to the minimal amount making the boards work only during opening hours. More deep analysis should be carried in the future to check whether the activity of the boards exceeds an acceptable limit of battery consumption.

- In the scenario of putting one board on each piece, a museum with very much pieces could find it too expensive; therefore, the cost evaluation could take into account the possibility of putting less boards (e.g. one for room) and see how it affects the other metrics (still taking into account how many pieces the museum exposes).


