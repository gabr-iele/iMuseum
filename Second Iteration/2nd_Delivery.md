# 2nd Delivery

This document provides the updates done to all the aspects of the project (architecture, design, evaluation) made from the first delivery, basing on the suggestions received in order to improve the idea and the service implementing it.

## 1) Comments received and adjustments

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

(**Design**) Added more information about the interviews;  
(**Architecture**) Substitution of the protocol in the communication from IPv6 Gateway to backend, from COAP to MQTT;
(**Architecture**) Introduction of a function in the dashboard to update the hours of opening and closure for the boards;
(**Architecture**) Introduction of a function for the boards to start/stop their activity, basing on the museum's schedules;
(**Evaluation**) Introduction of *energy consumption* as evaluation parameter for the BLE boards/beacons.


## 3) Technical work done so far

- Set up of the cloud architecture: the data storage, the login microservice, the files storage and the server to host the Application Logic tier.

- The curator front-end application: set up of the project using the react framework, the login and signup process along with the first drafts of UI design.


## 4) Evaluation done so far

### Cloud infrastracture costs

We choosed to employ Firebase as cloud backend in our final infrastructure. Given the work done at the time of the compilation of this document, the following costs have been taken into account:

  - Authentication: **$0.06/verification**
  - Storage: **$0.026/GB**
  - Realtime database: **$5/GB**
  - Functions invocation: **$0.40/million**
  - Hosting: **$0.026/GB**
  
Given an estimation of the visitors per year and the number of pieces of the museum, a total cost can be computed by taking into account the number of interactions that need to be processed. Using the example of the Sapienza Museum, dealing with an hypothetic average number of 200 visitors per day, a number of pieces of about 1200 and an optimistic opening time of 300 days/year, can be computed:
  - Less than **$5/year** for the realtime database, dealing with the storing of beacons rilevations;
  - 300 * 1200 * 200 = 72 million function invocations, corresponging to about **$30/year** (notice that this is a borderline scenario, hypothizing all users interacting with all the pieces in the museum);
  - A not excessive cost for the storage service, containing the info sent to users regarding the pieces (either text and pictures): this cost estimation is strictly linked to the characteristics of the museum (number of pieces, amount and type of information, quality of the same, and so on);
  - Negligible cost for the dashboard authentication
  - Negligible cost for the dashboard hosting

It is interesting to look how the overall cloud costs evaluation highly depends on the type of museum: its dimension, how many pieces it exposes, the amount of days it is open, etc. In particular, it is notable that statistics on the flow of visitors inside the museum higly affects the expected cost.

N.B. In the perspective of a real deployment scenario, the Pay-As-You-Go plan for Firebase has been employed to compute the costs, looking at the case of a long-term usage of the application.

## 5) Evaluation still to do

Until the 3rd delivery, we plan to evaluate the remaining aspects of the complete application, once the various components still to realize will be ready. Precisely, each time a new component will be completed, we plan to evaluate the metrics for the specific component and check whether and how it modifies the evaluation done for the other components and the overall system. In particular we plan to carry out an evaluation on:

  - The beacon components, concerning the various aspects and requirements specified in the evaluation document. Depending by the type of deployment and restriction for the current situation, different type of technologies using BLE may be object of the evaluation;
  - The user satisfaction for the interfaces, both on the visitor side and the curator one, using prototypes and testing them on an adequately large sample;
  - The quality of the communication, telling whether the overall flow of messages is acceptable and sustainable, in terms of latency, faults, correctness etc.


