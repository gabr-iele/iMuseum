# Why beacons

From the interviews conducted with potential users of the museum we found two problems/feature we wanted to address:

1. Find an easy and interactive way to provide visitors with information about the artworks.
2. Find a way to optimize the layout of the museum to improve the users' experience and to avoid having crowded sections (something that is always a problem as it makes it difficult to see the art pieces but even more important today with COVID-19).

Focusing on the second one as it is the most interesting, we need something to track the users inside the museum to implement it. We can divide the technologies to achieve this in two categories: the ones that need the user to collaborate in some form and the ones that are completely autonomous.

For the technologies that do not need any collaboration we found two main alternatives:
- Footfall sensors;
- Smart cameras.

Footfall sensors are those sensors that are capable of identifying when a person passes over them. They are generally used at the entrance of stores to count the number of people inside them. Even if they might work for museum made of a lot of small rooms by placing them near the doors, they are useless in the Sapienza's museum as it is composed of only two very large rooms full of artworks.
Smart cameras are RGB or thermal cameras coupled with a computer vision algorithm, that may or not be based on machine learning, capable of counting the number of people in the frame. Those might work for our project if properly positioned but have some drawbacks:
- When you have a lot of artworks very close to each other, like in the Sapienza's museum, it becomes difficult not to overlap the field of view of the cameras if you put one camera on each piece, thus we may be forced to reduce the granularity of the data by instead dividing the museum into sections containing multiple artworks and placing a camera in each section, thus having per section and not per artwork statistics.
- The type of statistics that we can provide are limited to those based on counting the people inside the camera image. Among those that we were considering one that we would not be able to do are the most common paths of visitors inside the museum.
- By using only cameras we can only implement the second feature, if we want to do also the first we need additional hardware.

There are technologies that require some form of user interaction that we could use to know where he is in the museum. Unfortunately, requiring the users’ intervention may be a big problem as we can’t force them, we need to give them something in exchange for their participation. This is why if we want to use this type of technology we also need to implement the first feature: to get the information about the artworks the visitors will need to interact with the system and so we will be able to locate them.
The technologies that we considered are the following:
- NFC;
- Beacon.

With NFC we would need to place an NFC tag on each artwork. A visitor would use a device with an NFC reader to scan the tag and get the information about the artwork, and we would know that he is in front of that specific artwork. NFC allows us to provide all the statistics we are considering but it has two problems:
1. Since a big portion of the smartphones in the market do not have an NFC reader accessible by developers, notably iPhones, we cannot rely on the user’s device, the museum would need to provide it.
2. There is a potential safety problem for the artworks based on where the NFC tag is positioned. In fact, if we put the tag on the pedestal of the artwork the user may get too close to scan it. Alternatively, something to hold the NFC tag would need to be constructed, occupying valuable space in the museum.

With Bluetooth Beacons the interaction is similar: if a visitor approaches an artwork, the device recognizes the signal of the artwork and provides information about it, while the system records the interaction. As for NFC, this technology supports all the statistics we want to collect and also solves the two issues of NFC: every smartphone has a Bluetooth module so we can use the visitor’s smartphone and the range of Bluetooth is large enough not to require that the visitor comes dangerously close to the art piece.

The final decision so is between cameras and beacons. Beacons have the advantage of supporting both features, but they also have the problem of requiring the visitor's interaction, so if one user decides not to use the app to get information about the artworks his visit will be missing from the statistics. On the other side, cameras don’t have this problem, but we can’t use them to provide information to the visitors and we have also some limits on the type of statistics we can provide.

In the end we decided to stick with Beacons as they allow us to implement both features. Even if not everyone downloads the app, if a large enough percentage of visitors do, it will be enough to understand the behavior of the average visitor and thus provide the curators with valuable information to improve the museum.
