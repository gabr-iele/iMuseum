# 2nd Delivery

This document provides the updates done to all the aspects of the project (architecture, design, evaluation) made from the first delivery, basing on the suggestions received in order to improve the idea and the service implementing it.

## 1) Comments received and adjustations

- "I like the features for curators. I would focus on it."

We decided to address the functionalities of the application mainly to the providing of statistics for the curator, also increasing their variety and improving the quality of the ones we already had taken into account, but still enabling the information retrieval service for users of many types.

- "Why COAP being an async app?"

The initial architecture employed COAP in the communication between the local gateway in the museum and the backend. Since the "alive" messages sent by the boards have an asynchronous nature, we decided to change the communication protocol to adapt to this aspect; in the new architecture, the gateway will communicate directly with the built-in broker of the backend through MQTT.

- "You are doing sampling even when nobody is there. Is this energy efficient enough?"

That's a really important concern in terms of battery saving: in a scenario of forever-working boards, they would continue emitting packets for the whole day, even after the museum closes. This is clearly non-optimal, because messages sent when nobody is in the museum are completely useless, but still consuming battery and making its life shorter with no benefits. It has then been decided to provide to the boards (through the dashboard) the hours of opening and closure of the museum, allowing them to interrupt the emission of data and opportunely restart it when needed. This would restrict the activity of boards to the time of the day in which the museum is open to visitors, maximizing the efficiency in terms of battery lasting and reducing the resulting costs.

- "Questionnaire?"

We did multiple interviews, instead of using questionnaires, both at the beginning of the design phase, to understand the problems in the experience of the visitors of the museum that we could address, and throughout the phase to define and validate the features of our project. The design document has been updated to provide more details about the interviews.

- "BLE is too common among projects"

We analyzed other technologies that we could use to address the problems we found in the experience of the users of the museum. In the end we decided to stick with BLE Beacon as we think it is the best technology to implement our ideas. More information on this can be found in the document [Why_beacons.md](./Why_beacons.md).


## 2) Changes to architecture, design, evaluation

(**Architecture**) Substitution of the protocol in the communication from IPv6 Gateway to backend, from COAP to MQTT;
(**Architecture**) Introduction of a function in the dashboard to update the hours of opening and closure for the boards;
(**Architecture**) Introduction of a function for the boards to start/stop their activity, basing on the museum's schedules;
(**Evaluation**) Introduction of *energy consumption* as evaluation parameter for the BLE boards/beacons.
// TODO


## 3) Technical work done so far

// TODO


## 4) Evaluation done so far

// TODO


## 5) Evaluation still to do

// TODO
