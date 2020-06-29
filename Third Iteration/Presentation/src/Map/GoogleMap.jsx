import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react';

import global from "../global.json";

class GoogleMap extends Component {

    state = {
        defaultLocation: {
            latitude: 41.893230,
            longitude: 12.493060,
            name: "Sapienza University"
        }
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.location.latitude === undefined || nextProps.location.longitude === undefined){
            return;
        }
           

        if(nextProps.location.latitude !== this.state.defaultLocation.latitude || 
            nextProps.location.longitude !== this.state.defaultLocation.longitude){
            this.setState({
                defaultLocation:{
                    latitude:nextProps.location.latitude,
                    longitude:nextProps.location.longitude,
                    name:nextProps.location.name
                }
            })
           
        }
    }


    render() {
        const condition = this.props.location !== undefined && this.props.location.latitude !== undefined && this.props.location.longitude !== undefined;
        const initialLocation = (condition) ? this.props.location : this.state.defaultLocation;

        return (
            <Map google={this.props.google} zoom={14}
                initialCenter={{ lat: initialLocation.latitude, lng: initialLocation.longitude }}>

                <Marker onClick={this.onMarkerClick}
                    name={'Current location'} />

                <InfoWindow onClose={this.onInfoWindowClose}>
                    <div>
                        <h1>{"Hello,world!"}</h1>
                    </div>
                </InfoWindow>
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: (global.SERVICES.GOOGLEMAPS.API)
})(GoogleMap)