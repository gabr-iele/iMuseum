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


## Evaluation

/* TODO */
