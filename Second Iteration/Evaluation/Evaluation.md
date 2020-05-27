# Evaluation


This document defines how to estimate the quality of the implemented product, from both a mere technical point of view and the perspective of a possible user of the system.
This will be carried out, for both the overall system and the isolated components, through:
- the observation of specific **indicators**, concerning the costs involved in the application's lifecycle,
- the analysis of **user feedback**, based on many aspects related to the quality of service.

The analysis will cover estimations both from the perspective of the whole system and of the single components involved in the process.


## Cost metrics

1. **Latency**: depending on the type of flow of information, the maximum delay tolerance changes due to different QoS requirements.

    - *Very low delay for retrieval of information from the backend database by the user*: the user should have the impression of a normal real-time visit, with no long waitings, reading information by a synopsis. Also, since the application is designed to make the collection of academic information more practical for students, low latency is required for providing a useful service.
    - *Very low delay for beacon detection when entering in its scope*: the mobile application should notice the presence of a beacon by its signal very quickly, in order to notify the application logic as soon as possible and always get a consistent report of the visit.
    - *No excessive delay for beacons liveness notification*: depending on the maximum delay fixed to establish a beacon is not alive anymore, the time for a beacon notification message to arrive at the gateway should always be below the threshold; this enforces accuracy on the system detecting what beacons have gone down.

    For each of these data flows, measurements can be carried on during a testing phase and readapted to guarantee the desired behavior.

2. **Cloud infrastracture maintenance**: the overall system employs various cloud resources, which, in the perspective of long-term use of the application, contemplate fixed periodic costs in charge of the museum.

    - *Data storing*: the system will need to keep track of what art pieces have been visited in a tour by each user, information in many forms (documents, pictures) about all the art pieces exposed by the museum, and control information about the beacon sensors. Basing on a unit measure of $/GiB, a cost comparison can be carried out in order to adopt the most convenient cloud service provider.
    - *Messages exchange*: the overall cloud infrastructure will exchange messages with the users, the beacons and the web application during its lifecycle, getting and sending information from them. Similarly to data storing, a measurement based on $/message can be done and used to minimize the costs.
    - *IPv6 bridge*: the beacons control information needs to be bridged from the IPv6 gateway to the cloud infrastructure by a program running on a host machine; the cost of hosting has to be included in the total expense.

    The overall cost will be computed by the sum of these three components and compared for various available provider choices. Another approach during the evaluation process, different from the simple cost minimization, could be studying the cost requirements crossed with the user ones, and act a tradeoff based on what aspects are more relevant to provide the user a good experience (e.g. spend more for a provider with better latency and invest less in the quality of the beacons).
    
3. **Beacons efficiency**: a choice can be carried out also on what beacons to employ, based on various characteristics of the sensors and the requirements of the service.

    - *Scope*: the range, measured in meters, of action of each sensor, depending by various factors (position of the pieces inside the museum, proximity of the user to them, etc.).
    - *Liveness*: duration of the battery, important to consider in the expense for energy consumption by the museum.
    - *Energy consumption*: amount of electrical energy required by the boards for the communication in a fixed interval of time. Strictly related to the liveness of the board's battery, it has been introduced in the evaluation plan to directly deal with the problem of whether to stop and start the communication, in order to avoid wastings of energy during periods of inactivity of the museum. Through this measurement, we have a direct view of how good we are managing the problem and whether and how the efficiency can be increased.
    - *Cost*: money expense depending on the model and the provided functionalities.

    By acting a tradeoff on these three parameters, the museum can select an optimal model of beacon for the pieces; as done before, more weight can be given to one or more of the aspects depending by what are the requirements and what aspect of the communications needs to be enforced.


## User feedback criterions

The overall system will have to provide information which has to be:
  - **Complete**: every art piece met during a visit (and no others) must appear in the report sent to the user;
  - **Useful**: the modality of retrieving info has to provide some benefit in terms of practicality and convenience;
  - **Academic**: since the final user of the service will be any academic figure (students, researchers, professors) and not only visitors, the provided info has to be useful and detailed for academic purposes.

By the analysis of these three main requisites, the following properties required for the service can be identified:

1. **Usefulness**: the service should be preferable to other information retrieval modes in terms of speed, easiness and efficiency, in order to grant a real improvement and be actually deployable in a real scenario;

2. **Enjoyment**: a benefit should also be provided to the ordinary tour in a museum, joining both the useful aspect of information research and the entertainment one of a visit;

3. **Correctness**: consistency has to be granted for the report of each visit; the user should see all the information about only the pieces he/she visited, i.e. should get exactly what he/she is looking for and nothing more;

4. **Statistics accuracy**: correctness is required from the perspective of curators too; the statistics retrieved by each visit will be used for trend studies and improvement of the experience, so they have to be precise and complete;

5. **Practicality**: the service should appear to the user as simple as possible to use, to contribute with the easiness of collecting information from the perspective of the user. Due to this, an extremely user-friendly interface and easing as much as possible the overall process are crucial aspects.


These aspects, strongly linked with the experience of the user and his/her needs, can be directly evaluated by user-driven research, retrieving feedbacks during a test phase and basing studies and, where convenient, successive improvements to the system in order to provide a more enjoyable service.

**Important**: due to the current emergency, whether it will not be possible to deploy the application in a real-world scenario, some modifications will be applied to the user feedback retrieval. In particular, a user interface with appropriate logic below simulating the arriving of the desired info about art pieces: in this way, the users will be able to try a service as near as possible to the real one and evaluate, with a good margin of error, the metrics defined above. For the statistics dashboard the situation is slightly different, since it is not possible to retrieve real and useful statistics; due to this, aspects like accuracy or usefulness may not be evaluated in a worst-case scenario.


## Security concerns

Finally, a further study can be carried out for security and privacy aspects linked to the user. Since the application, even if in the scope of the museum, tracks the activity of the users and keeps the information about visits for statistic purposes, the least amount possible of data should be required by the users. They should be informed in detail of how their data will be used, and give permission to the overall system for collecting information before it starts.

