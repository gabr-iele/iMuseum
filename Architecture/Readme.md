
# Introduction and System Description

iMuseum is a distributed system to enhance the experience for a visitor in a museum: it uses IOT devices placed on each art piece to provide informations to the user through a mobile app using the bluetooth beacon mode.

Once the visit is over, the user will get a report of all the pieces seen in the visit.

The system also provides to the curator of the museum/exhibition all the informations about the devices status, a record of all the visitors along with the path and pieces seen inside the museum and all the informations about the sensors status to help notify the maintenance about possible malfunctions.

# iMuseum Architecture

Here is shown a visual representation of the system’s architecture: 

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
