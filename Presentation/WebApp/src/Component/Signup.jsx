
import React, { Component } from 'react';
import global from "../global.json"

import m_Curator from "../Model/Curator";
import m_Museum from "../Model/Museum";

import placeholder from "../../src/resource/placeholder.png"
import GoogleMap from '../Map/GoogleMap';
import Spinner from "../Component/Spinner";
import System from '../System/System';
import Geocoder from '../Map/Geocoder';

import { Redirect } from "react-router-dom";


const divStyle = {
  background: "#ffffff",
  boxShadow:
    "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  borderBottomLeftRadius: 5,
  borderTopLeftRadius: 5,
  borderBottomRightRadius: 5,
  borderTopRightRadius: 5,
  margin: 10
};

/**
 * Component to signup inside the service
 * @author Giulio Serra 
 */
export default class Signup extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPage: 1,
      newCurator: {
        credentialWrapper: {}
      },
      newMuseum: {},
      refreshing:false,
      redirect:{
        shouldRedirect:false,
        to:"/",
      }
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleTextInput = this.handleTextInput.bind(this);
    this.handleUploadImmageRequest = this.handleUploadImmageRequest.bind(this);
    this.handleLocalizeRequest = this.handleLocalizeRequest.bind(this);
    this.handleDatePicking = this.handleDatePicking.bind(this);
  }

  /**
 * Handle the request to localize a museum
 * @author Giulio Serra 
 */
  handleLocalizeRequest(e) {
    e.preventDefault();
    let museum = this.state.newMuseum;

    if (System.prototype.isObjectEmpty(museum)){
      alert("You must provide the address info before localizing the museum.")
      return;
    }
      
    if (museum.street === undefined || museum.postalCode === undefined || museum.city === undefined) {
      alert("You must complete all fields!")
      return;
    }

    const address = museum.street + " " + museum.postalCode + " " + museum.city;
    Geocoder.prototype.getCoordinatesFromAddressAsync(address).then(response=>{
        museum.latitude = response.lat;
        museum.longitude = response.long;
        this.setState({newMuseum:museum})
    })
  }

  /**
  * Handle the request to upload an immage
  * @author Giulio Serra 
  */
  handleUploadImmageRequest(e) {
    e.preventDefault();
    const callerID = e.target.id;

    if (callerID === "profile_img") {
      document.getElementById("profile_picker").click();
      document.getElementById("profile_picker").onchange = (e) => {
        const file = e.target.files[0];
        if (file === undefined)
          return;

        let newCurator = this.state.newCurator;
        newCurator.immageFile = file;
        this.setState({ newCurator: newCurator });
      }
    }

    if (callerID === "museum_img") {
      document.getElementById("museum_cover_picker").click();
      document.getElementById("museum_cover_picker").onchange = (e) => {
        const file = e.target.files[0];
        if (file === undefined)
          return;

        let newMuseum = this.state.newMuseum;
        newMuseum.immageFile = file;
        this.setState({ newMuseum: newMuseum });
      }
    }
  }


  /**
  * Handle the request to change registration page
  * @author Giulio Serra 
  */
  handlePageChange(e) {
    e.preventDefault();
    const callerID = e.target.id;

    const new_curator = new m_Curator(this.state.newCurator);

    if (callerID === "first_page_next") {

      const validation = new_curator.validate(this.state.newCurator);

      if (validation.code !== "200") {
        alert(validation.message);
        return;

      } else {
        this.setState({ currentPage: 2 })
      }
    }

    if (callerID === "second_page_back") {
      this.setState({ currentPage: 1 })
    }

    if (callerID === "second_page_signup") {
  
      const museum = new m_Museum(this.state.newMuseum);
      const museum_validation = museum.validate(this.state.newMuseum);
      if (museum_validation.code !== "200") {
        alert(museum_validation.message);
        return;

      } else {
        let state_copy = this.state;
        state_copy.refreshing = true;
        this.setState({state_copy})

        new_curator.signupAsync(this.state.newCurator).then(response=>{
          const museum_wrapper = {ownerID:new_curator.ID,immageFile:this.state.newMuseum.immageFile}
          museum.postAsync(museum_wrapper).then(response=>{

            let newUser = new_curator.getJsonDescription();
            newUser[new_curator.ID].museums = Object.assign(newUser[new_curator.ID].museums,museum.getJsonDescription())
            
            this.props.loginHandler(newUser)
            this.setState({refreshing:false,redirect:{
              shouldRedirect:true,
              to:"/dashboard",
            }})
          })

        }).catch(err=>{
          this.setState({refreshing:false})
          alert(err);
          return;
        })

      }

    }

  }

  /**
  * Handle the date picking from the component
  * @author Giulio Serra 
  */
  handleDatePicking(e) {
    e.preventDefault();
    const callerID = e.target.id;
    let museum = this.state.newMuseum;

    const value = e.target.value;
    const date = new Date("01/01/1970" + " " + value);
    const timeStamp = date.getTime();

    switch (callerID) {

      case "museum_opening":
        museum.openingHours = timeStamp;
        break;

      case "museum_closure":
        museum.closingHours = timeStamp;
        break;

      default:
        break;
    }

    this.setState(museum);
  }

  /**
  * Handle the text input from the component
  * @author Giulio Serra 
  */
  handleTextInput(e) {
    e.preventDefault();
    const callerID = e.target.id;
    const value = e.target.value;

    let curator = this.state.newCurator;
    let museum = this.state.newMuseum;

    switch (callerID) {

      case "name_field":
        curator.name = value;
        break;

      case "surname_field":
        curator.surname = value;
        break;

      case "email_field":
        curator.credentialWrapper.email = value;
        break;

      case "password_field":
        curator.credentialWrapper.password = value;
        break;

      case "repeat_password_field":
        curator.credentialWrapper.repeatePassword = value;
        break;

      case "museum_name_field":
        museum.name = value;
        break;

      case "street_name_field":
        museum.street = value;
        break;

      case "postal_code_field":
        museum.postalCode = value;
        break;

      case "city_field":
        museum.city = value;
        break;

      default:
        break;
    }

    this.setState(museum);
    this.setState(curator);
  }

  /**
  * Create the registration page for a museum
  * @author Giulio Serra 
  */
  getSecondRegistrationModule() {

    let secondDivStyle = {
      background: "#ffffff",
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      borderBottomLeftRadius: 5,
      borderTopLeftRadius: 5,
      borderBottomRightRadius: 5,
      borderTopRightRadius: 5,
      margin: 10,
      paddingLeft: "0px",
      paddingRight: "0px",
      overflow: "hidden"

    };

    const museum = new m_Museum(this.state.newMuseum);

    const museumImage = (this.state.newMuseum.immageFile !== undefined) ?
      URL.createObjectURL(this.state.newMuseum.immageFile) : placeholder

    return (<div className="container" style={secondDivStyle}>

      <div className="col" style={{ paddingLeft: "0", paddingRight: "0px", color: global.GUI.RED }}>
        <img
          style={{ maxHeight: "400px", width: "800px", objectFit: "cover" }}
          id="museum_img"
          alt="museum_img" src={museumImage} onClick={this.handleUploadImmageRequest} />

        <input id="museum_cover_picker" type="file" hidden />

        <div style={{ padding: "10px 10px 10px 10px" }}>

          <div><b>Now tell us something about your museum!</b></div>

          <input
            style={{ marginTop: "10px" }}
            className="form-control"
            placeholder="Museum name"
            value={this.state.newMuseum.name}
            onChange={this.handleTextInput}
            id="museum_name_field"
          />
        </div>

        <div style={{ padding: "10px 10px 10px 10px" }}>
          <div><b>Opening hours:</b></div>

          <input style={{ marginTop: "10px" }} type="time" className="form-control" id="museum_opening"
            onInput={this.handleDatePicking}
            value={museum.getHumanReadableOpeningHours()} />

          <input style={{ marginTop: "10px" }} type="time" className="form-control"
            id="museum_closure" onChange={this.handleDatePicking} value={museum.getHumanReadableClosingHours()} />
        </div>

        <div style={{ padding: "10px 10px 10px 10px" }}><b>Where is it?</b></div>
        <div className="row" style={{ padding: "10px 10px 10px 10px", marginBottom: "40px" }}>

          <div className="col" style={{ marginRight: "10px" }}>
            <GoogleMap location={{latitude:this.state.newMuseum.latitude,longitude:this.state.newMuseum.longitude,name:"Your Museum"}} />
          </div>

          <div className="col">

            <input
              style={{ marginTop: "10px" }}
              className="form-control"
              placeholder="Street"
              value={this.state.newMuseum.street}
              onChange={this.handleTextInput}
              id="street_name_field"
            />

            <input
              style={{ marginTop: "10px" }}
              className="form-control"
              placeholder="Postal Code"
              onChange={this.handleTextInput}
              value={this.state.newMuseum.postalCode}
              id="postal_code_field"
            />

            <input
              style={{ marginTop: "10px", marginBottom: "10px" }}
              className="form-control"
              placeholder="City"
              onChange={this.handleTextInput}
              value={this.state.newMuseum.city}
              id="city_field"
            />

            <button
              style={{ marginTop: "10px" }}
              id="second_page_signup"
              className="btn btn-primary"
              style={{ width: "100px" }}
              onClick={this.handleLocalizeRequest}
            >
              <b>Localize</b>
            </button>

          </div>

        </div>


        <div className="row justify-content-center" style={{ marginTop: "20px", marginBottom: "20px" }}>

          <button
            id="second_page_back"
            className="btn btn-secondary"
            style={{ marginRight: "20px", width: "100px" }}
            onClick={this.handlePageChange}
          >
            <b>Back</b>
          </button>

          <button
            id="second_page_signup"
            className="btn btn-primary"
            style={{ width: "100px" }}
            onClick={this.handlePageChange}
          >
            <b>Signup!</b>
          </button>
        </div>
      </div>
    </div>);
  }

  /**
  * Create registration page for a curator
  * @author Giulio Serra 
  */
  getFirstRegistrationModule() {

    const curatorImage = (this.state.newCurator.immageFile !== undefined) ?
      URL.createObjectURL(this.state.newCurator.immageFile) : placeholder


    return (<div className="container" style={divStyle}>
      <div className="row justify-content-center"
        style={{ marginBottom: "20px", marginTop: "20px", color: global.GUI.RED, fontSize: "30px" }}>

        <div
          className="col justify-content-center"
          style={{
            alignContent: "center"
          }}
        >

          <center>
            <img className="rounded-circle"
              style={{ height: "200px", width: "200px", objectFit: "cover" }}
              id="profile_img"
              alt="curator_profile_img" src={curatorImage} onClick={this.handleUploadImmageRequest} />
            <input id="profile_picker" type="file" hidden />

          </center>

          <div style={{ fontSize: "20px", marginTop: "20px" }}><b>Tell us something about you!</b></div>

          <input
            style={{ marginTop: 10 }}
            className="form-control"
            placeholder="Name"
            value={this.state.newCurator.name}
            onChange={this.handleTextInput}
            id="name_field"
          />

          <input
            style={{ marginTop: 10 }}
            className="form-control"
            placeholder="Surname"
            value={this.state.newCurator.surname}
            onChange={this.handleTextInput}
            id="surname_field"
          />

          <input
            style={{ marginTop: 10 }}
            type="email"
            className="form-control"
            aria-describedby="emailHelp"
            placeholder="Email"
            value={this.state.newCurator.credentialWrapper.email}
            onChange={this.handleTextInput}
            id="email_field"
          />

          <input
            style={{ marginTop: 10 }}
            type="password"
            className="form-control"
            placeholder="Password"
            onChange={this.handleTextInput}
            value={this.state.newCurator.credentialWrapper.password}
            id="password_field"
          />

          <input
            style={{ marginTop: 10 }}
            type="password"
            className="form-control"
            placeholder="Repeate Password"
            onChange={this.handleTextInput}
            value={this.state.newCurator.credentialWrapper.repeatPassword}
            id="repeat_password_field"
          />


          <div className="row justify-content-center" id="first_page_next">
            <button
              id="first_page_next"
              className="btn btn-primary"
              style={{ marginTop: 20, width: "90%" }}
              onClick={this.handlePageChange}
            >
              <b>Next</b>
            </button>
          </div>

        </div>
      </div>
    </div>);
  }

  render() {
  
    return (<div style={{ marginTop: "70px" }}>
      <form>
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh"
          }}
        >
          <div className="row justify-content-center">
            {(this.state.redirect.shouldRedirect)? <Redirect to={this.state.redirect.to} /> : null}
            {(this.state.refreshing)? <Spinner/> : null}
            {(this.state.currentPage === 1 && !this.state.refreshing) ? this.getFirstRegistrationModule() : null
          }{
              (this.state.currentPage === 2 && !this.state.refreshing) ? this.getSecondRegistrationModule() : null
            }</div>
        </div>

      </form>
    </div>)
  }
}