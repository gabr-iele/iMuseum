import React, { Component } from "react";

import m_Curator from "../Model/Curator";
import m_Museum from "../Model/Museum";

import Spinner from "./Spinner";
import System from "../System/System";
import Geocoder from "../Map/Geocoder";

import { Redirect } from "react-router-dom";
import Curator from "../Component/Curator";
import Museum from "../Component/Museum";

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
        credentialWrapper: {},
      },
      newMuseum: {},
      refreshing: false,
      redirect: {
        shouldRedirect: false,
        to: "/",
      },
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

    if (System.prototype.isObjectEmpty(museum)) {
      alert("You must provide the address info before localizing the museum.");
      return;
    }

    if (
      museum.street === undefined ||
      museum.postalCode === undefined ||
      museum.city === undefined
    ) {
      alert("You must complete all fields!");
      return;
    }

    const address = museum.street + " " + museum.postalCode + " " + museum.city;
    Geocoder.prototype
      .getCoordinatesFromAddressAsync(address)
      .then((response) => {
        museum.latitude = response.lat;
        museum.longitude = response.long;
        this.setState({ newMuseum: museum });
      });
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
        if (file === undefined) return;

        let newCurator = this.state.newCurator;
        newCurator.immageFile = file;
        this.setState({ newCurator: newCurator });
      };
    }

    if (callerID === "museum_img") {
      document.getElementById("museum_cover_picker").click();
      document.getElementById("museum_cover_picker").onchange = (e) => {
        const file = e.target.files[0];
        if (file === undefined) return;

        let newMuseum = this.state.newMuseum;
        newMuseum.immageFile = file;
        this.setState({ newMuseum: newMuseum });
      };
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
        this.setState({ currentPage: 2 });
      }
    }

    if (callerID === "second_page_back") {
      this.setState({ currentPage: 1 });
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
        this.setState({ state_copy });

        new_curator
          .signupAsync(this.state.newCurator)
          .then((response) => {

            const museum_wrapper = {
              ownerID: new_curator.ID,
              immageFile: this.state.newMuseum.immageFile,
            };
            
            museum.postAsync(museum_wrapper).then((response) => {
              let newUser = new_curator.getJsonDescription();
              newUser[new_curator.ID].museums = Object.assign(
                newUser[new_curator.ID].museums,
                museum.getJsonDescription()
              );

              this.props.loginHandler(newUser);
              this.setState({
                refreshing: false,
                redirect: {
                  shouldRedirect: true,
                  to: "/dashboard",
                },
              });
            }).catch((err) => {
              this.setState({ refreshing: false });
              alert(err);
              return;
            });
          })
          .catch((err) => {
            this.setState({ refreshing: false });
            alert(err);
            return;
          });
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
    return (
      <Museum
        newMuseum={this.state.newMuseum}
        handleUploadImmageRequest={this.handleUploadImmageRequest}
        handleTextInput={this.handleTextInput}
        handleDatePicking={this.handleDatePicking}
        handleLocalizeRequest={this.handleLocalizeRequest}
        handlePageChange={this.handlePageChange}
      />
    );
  }

  /**
   * Create registration page for a curator
   * @author Giulio Serra
   */
  getFirstRegistrationModule() {
    return (
      <Curator
        newCurator={this.state.newCurator}
        handleUploadImmageRequest={this.handleUploadImmageRequest}
        handlePageChange={this.handlePageChange}
        handleTextInput={this.handleTextInput}
      />
    );
  }

  render() {
    return (
      <div style={{ marginTop: "70px" }}>
        <form>
          <div
            className="container"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <div className="row justify-content-center">
              {this.state.redirect.shouldRedirect ? (
                <Redirect to={this.state.redirect.to} />
              ) : null}
              {this.state.refreshing ? <Spinner /> : null}
              {this.state.currentPage === 1 && !this.state.refreshing
                ? this.getFirstRegistrationModule()
                : null}
              {this.state.currentPage === 2 && !this.state.refreshing
                ? this.getSecondRegistrationModule()
                : null}
            </div>
          </div>
        </form>
      </div>
    );
  }
}
