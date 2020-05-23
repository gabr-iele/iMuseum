# 2nd Delivery

This document provides the updates done to all the aspects of the project (architecture, design, evaluation) made from the first delivery, basing on the suggestions received in order to improve the idea and the service implementing it.

## 1) Comments received and adjustations

- "I like the features for curators. I would focus on it."

We decided to address the functionalities of the application mainly to the providing of statistics for the curator, also increasing their variety and improving the quality of the ones we already had taken into account, but still enabling the information retrieval service for users of many types.

- "Why COAP being an async app?"

// TODO

- "You are doing sampling even when nobody is there. Is this energy efficient enough?"

That's a really important concern in terms of battery saving: in a scenario of forever-working boards, they would continue emitting packets for the whole day, even after the museum closes. This is clearly non-optimal, because messages sent when nobody is in the museum are completely useless, but still consuming battery and making its life shorter with no benefits. It has then been decided to provide to the boards (through the dashboard) the hours of opening and closure of the museum, allowing them to interrupt the emission of data and opportunely restart it when needed. This would restrict the activity of boards to the time of the day in which the museum is open to visitors, maximizing the efficiency in terms of battery lasting and reducing the resulting costs.

- "Questionnaire?"

// TODO


## 2) Changes to architecture, design, evaluation

// TODO


## 3) Technical work done so far

// TODO


## 4) Evaluation done so far

// TODO


## 5) Evaluation still to do

// TODO

