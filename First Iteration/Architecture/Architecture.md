# Introduction and System Description

iMuseum is a distributed system to enhance the experience for a visitor in a museum: it uses IOT devices placed on each art piece to provide pieces of information to the user through a mobile app using the Bluetooth beacon mode.
Once the visit is over, the user will get a report of all the pieces seen in the visit.
The system also provides to the curator of the museum/exhibition all the information about the devices status, a record of all the visitors along with the path and pieces seen inside the museum, and all the information about the status of the sensors, to help notify the maintenance about possible malfunctions.
iMuseum Architecture
Here is shown a visual representation of the system’s architecture:

 
<div align="center">
<img src="https://github.com/Giulio64/IOT2020BigProject/blob/master/First%20Iteration/Architecture/src/architecture.png" >
</div>

starting from the right we have a variable number of IOT boards (one on each piece) that communicates to a mobile app using the Bluetooth beacon mode: once a visitor comes near a piece, the mobile application will ask the user if he/she wants to know more information about it, if it’s the case, the system will automatically record the preference and provide a comprehensive list of information about the piece.
All the information about the user and the visits can be easily seen by the curator of the museum using a web app that also provides information about the status of the sensors, notifying the administrator about possible failures of one or more of the sensors. The data comes periodically from the beacons to a gateway board with COAP support (one for every museum) and then sent back to a COAP bridge to finally come over HTTP to the Application Logic tier trough REST endpoints, to be stored inside the Storage.

# Hardware Components

## Bluetooth IOT Board
Category: IOT
The Bluetooth IOT board is in charge of beaming data using the Bluetooth beacon mode (https://en.wikipedia.org/wiki/Bluetooth_low_energy_beacon), providing the information of the piece where it’s placed, it also communicates to a COAP gateway, data about its status through the IEEE_802.15.4 protocol (https://en.wikipedia.org/wiki/IEEE_802.15.4).
The board that can best handle both the data transmission is the nRF52840DK (https://www.nordicsemi.com/Software-and-Tools/Development-Kits/nRF52840-DK) that can handle both Bluetooth and low-data wireless transmission.

## IPV6 Gateway Board
Category: Edge Component
The IPV6 gateway board (https://www.st.com/en/evaluation-tools/stm32-nucleo-boards.html/) receives all the information of the local network of the museum and forward them to the internet. It also run a RIOT application to detect incoming data from the status of the sensors, scattered in the exhibition.
The real-world device deployed in the net uses a STM nucleo board(https://www.st.com/en/evaluation-tools/p-nucleo-wb55.html) pared with an ethernet module (https://www.ebay.it/itm/Arduino-Compatibile-Modulo-scheda-ethernet-rete-ENC28J60-LAN-Atmel-STM-ARM-/222596170068).

## Smartphone (Mobile App)
Category: End-user component
The visitor will use his/her own smartphone (it can either run iOS or Android) to obtain the identifier of a piece using Bluetooth, and uses it to obtain all the related information from the CLOUD structure.

## MQTT Broker/Bridge
Category: Cloud Component
The MQTT Bridge is in charge of receiving data from the both from gateway and the application logic and forward them to the right subscribers.


## Application Logic
Category: Cloud Component
The Application Logic tier is in charge to handle all the requests coming via REST protocol, mainly to all the resources/data inside the storage, it’s deployed inside the firebase cloud infrastructure (https://firebase.google.com).

## Storage
Category: Cloud Component
Is in charge of the persistence of the data about the sensors status, visitors identities, pieces images, pieces documents etc.. it also deployed inside the FCI (https://firebase.google.com)

## Web App
Category: End-user component
It displays all the information to a curator of a museum/exhibition about all the visits, (in particular the preferred routes in each visit), the status of all the IOT sensors and finally a curator can create/ delete sensors inside the museum.

# Software Components

## RIOT OS
RiotOS (https://www.riot-os.org) is an operating system used as a base to write firmware for a variety of embedded boards in C language, it’s used to send data from the Bluetooth nodes and from the COAP gateway to the COAP bridge.

## MQTT
It’s a lightweight publish-subscriber protocol(http://mqtt.org). It’s used both to forward the data coming from the boards, to the Application logic and the other way around.

## Ponte
Eclipse framework(https://www.eclipse.org/ponte/) that receives MQTT data and forward them to the cloud using REST, used both to bridge the gap between the edge of the IOT system and CLOUD infrastructure and ensure a two way communication channel between the Application logic and the boards.

## REST
It’s an architecture that lets web service communicate, it’s the base form of communication(over the HTTP protocol) between all the elements inside the cloud and the end-user presentation elements (https://en.wikipedia.org/wiki/Representational_state_transfer).

## Xamarin Forms
It's a framework that translates C# (OOP Language) at runtime to a native mobile device (can either be iOS or Android), used as a base to build the presentation to the user of the mobile app (https://docs.microsoft.com/it-it/xamarin/xamarin-forms/).

## Javascript
High-level programming language used both in the application logic and the presentation to the user in the form of the web app(https://en.wikipedia.org/wiki/JavaScript).

## React Web
Framework to build interfaces combining HTML for the GUI and javascript for the scripting logic used to build the web application to consult information and data for the web app (https://en.wikipedia.org/wiki/JavaScript).
