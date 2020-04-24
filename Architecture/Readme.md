
# Introduction and System Description

iMuseum is a distributed system to enhance the experience for a visitor in a museum: it uses IOT devices placed on each art piece to provide informations to the user through a mobile app using the bluetooth beacon mode.

Once the visit is over, the user will get a report of all the pieces seen in the visit.

The system also provides to the curator of the museum/exhibition all the informations about the devices status, a record of all the visitors along with the path and pieces seen inside the museum and all the informations about the sensors status to help notify the maintenance about possible malfunctions.

# iMuseum Architecture

Here is shown a visual representation of the system’s architecture: 

 ![Tux, the Linux mascot](https://github.com/Giulio64/IOT2020BigProject/blob/master/Architecture/src/architecture.png)

starting from the right we have a variable number of IOT boards (one on each piece) that communicates to a mobile app using the bluetooth beacon mode: once a visitor comes near a piece, the mobile application will ask to the user if he/she want to know more informations about it, if it’s the case, the system will automatically record the preference and provide a comprehensive list of informations about the piece.

All the informations about the user and the visits can be easily seen by the curator of the museum using a web app that also provides informations about the status of the sensors, notifying the administrator about possible failures of one or more of the sensors.
The data comes periodically from the beacons to a gateway board with COAP support (one for every museum) and then sent back to a COAP bridge to finally comes over HTTP to the Application Logic tier trough REST endpoints, to be stored inside the Storage.


# Hardware Components


## Bluetooth IOT Board 
### Category: IOT

The Bluetooth IOT board is in charge of beaming data using the bluetooth beacon mode (https://en.wikipedia.org/wiki/Bluetooth_low_energy_beacon), providing the informations of the piece where it’s placed, it also communicate to a COAP gateway, data about it’s status through the IEEE_802.15.4 protocol (https://en.wikipedia.org/wiki/IEEE_802.15.4).

The board that can best handle both the data transmission is the nRF52840DK (https://www.nordicsemi.com/Software-and-Tools/Development-Kits/nRF52840-DK) 
that can handle both bluetooth and low-data wireless transmission.

It also runs a RIOT OS firmware to detect visitor proximity and send telemetry data about the board’s status.


## IPV6 Gateway Board
### Category: Edge Component

The IPV6 gateway board (https://www.iot-lab.info/hardware/m3/) receives all the informations of local network of the museum and forward them to the internet. It also run a RIOT application to detect incoming data from the sensors status, scattered in the exhibition.

## Smartphone (Mobile App)
### Category: End-user component

The visitor will use his/her own smartphone (it can either run iOS or Android) obtain the identifier of a piece, using bluetooth, and uses it to obtain all the related informations from the CLOUD structure.

## COAP Bridge
### Category: Cloud Component

The COAP Bridge is in charge of receiving data from the COAP gateway and forwards them to the Application login tier using the HTTP and REST protocol.

## Application Logic
### Category: Cloud Component

The Application Logic tier is in charge to handle all the request coming via REST protocol, mainly to all the resources/data inside the storage, it’s deployed inside the firebase cloud infrastructure (https://firebase.google.com).


## Storage
### Category: Cloud Component
Is in charge of the persistence of the data about the sensors status, visitors identities, pieces images, pieces documents etc.. it also deployed inside the FCI (https://firebase.google.com)

## Web App
### Category: End-user component

It displays all the informations to a curator of a museum/exhibition about all the visits, (in particular the preferred routes in each visit), the status of all the IOT sensors and finally a curator can create/ delete sensors inside the museum.

# Software Components

## RIOT OS
RiotOS (https://www.riot-os.org) is operative system used as base to write firmwares for a variety of embedded boards in C language, it’s used to send data from the bluetooth nodes and from the COAP gateway to the COAP bridge. 

## COAP 
It’s a constrained protocol to let nodes to communicate to the wider internet(https://en.wikipedia.org/wiki/Constrained_Application_Protocol),it's used to let the edge network communicate with the cloud infrastructure.

## Ponte
Eclipse framework(https://www.eclipse.org/ponte/) that receives COAP data and forward them to the cloud using REST, used to bridge the gap between the edge of the IOT system and CLOUD infrastructure.

## REST
It’s an architecture that let web service communicate, it’s the the base form of communication(over the HTTP protocol) between all the elements inside the cloud and the end-user presentation elements (https://en.wikipedia.org/wiki/Representational_state_transfer).

## Xamarin Forms
It a framework that translate C# (OOP Language) at runtime to a native mobile device (can either be iOS or Android), used as a base to build the presentation to the user of the mobile app (https://docs.microsoft.com/it-it/xamarin/xamarin-forms/).

## Javascript
High-level programming language used both in the application logic and the presentation to user in the form of the web app(https://en.wikipedia.org/wiki/JavaScript).

## React Web
Framework to build interfaces combining HTML for the GUI and javascript for the scripting logic, used to build the web application to consult informations and data for the web app (https://en.wikipedia.org/wiki/JavaScript).



