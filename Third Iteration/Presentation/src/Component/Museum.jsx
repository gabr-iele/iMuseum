import React, { Component } from "react";
import global from "../global.json";

import placeholder from "../../src/resource/placeholder.png";

import m_Museum from "../Model/Museum";

/**
 * Component to signup inside the service
 * @author Giulio Serra
 */
export default class Museum extends Component {
  render() {
    const secondDivStyle = {
      background: "#ffffff",
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      borderBottomLeftRadius: 5,
      borderTopLeftRadius: 5,
      borderBottomRightRadius: 5,
      borderTopRightRadius: 5,
      marginTop: "250px",
      marginBottom: "50px",
      paddingLeft: "0px",
      paddingRight: "0px",
      overflow: "hidden",
    };

    const museum = new m_Museum(this.props.newMuseum);

    const museumImage =
      this.props.newMuseum.immageFile !== undefined
        ? URL.createObjectURL(this.props.newMuseum.immageFile)
        : placeholder;

    const shouldDisplayLocalizationMessage = this.props.newMuseum.latitude !== undefined && this.props.newMuseum.longitude? null : "none";
    
    return (
      <div className="container" style={secondDivStyle}>
        <div
          className="col"
          style={{
            paddingLeft: "0",
            paddingRight: "0px",
            color: global.GUI.RED,
          }}
        >
          <img
            style={{ maxHeight: "400px", width: "800px", objectFit: "cover" }}
            id="museum_img"
            alt="museum_img"
            src={museumImage}
            onClick={this.props.handleUploadImmageRequest}
          />

          <input id="museum_cover_picker" type="file" hidden />

          <div style={{ padding: "10px 10px 10px 10px" }}>
            <div>
              <b>Now tell us something about your museum!</b>
            </div>

            <input
              style={{ marginTop: "10px" }}
              className="form-control"
              placeholder="Museum name"
              value={this.props.newMuseum.name}
              onChange={this.props.handleTextInput}
              id="museum_name_field"
            />
          </div>

          <div style={{ padding: "10px 10px 10px 10px" }}>
            <div>
              <b>Opening hours:</b>
            </div>

            <input
              style={{ marginTop: "10px" }}
              type="time"
              className="form-control"
              id="museum_opening"
              onInput={this.props.handleDatePicking}
              value={museum.getHumanReadableOpeningHours()}
            />

            <input
              style={{ marginTop: "10px" }}
              type="time"
              className="form-control"
              id="museum_closure"
              onChange={this.props.handleDatePicking}
              value={museum.getHumanReadableClosingHours()}
            />
          </div>

          <div style={{ padding: "0px 10px 10px 10px" }}>
            <b>Where is it?</b>
          </div>
          <div
            className="row"
            style={{ padding: "0px 10px 10px 10px", marginBottom: "40px" }}
          >
            <div className="col">
              <input
                className="form-control"
                placeholder="Street"
                value={this.props.newMuseum.street}
                onChange={this.props.handleTextInput}
                id="street_name_field"
              />

              <input
                style={{ marginTop: "10px" }}
                className="form-control"
                placeholder="Postal Code"
                onChange={this.props.handleTextInput}
                value={this.props.newMuseum.postalCode}
                id="postal_code_field"
              />

              <input
                style={{ marginTop: "10px", marginBottom: "10px" }}
                className="form-control"
                placeholder="City"
                onChange={this.props.handleTextInput}
                value={this.props.newMuseum.city}
                id="city_field"
              />

              <div className="display" 
              style={{display:shouldDisplayLocalizationMessage}}>
                <b>Your museum was sucessfully localized!</b>
              </div>

              <div
                className="d-flex justify-content-center"
                style={{ marginTop: "20px" }}
              >
                {" "}
                <button
                  style={{ marginTop: "10px" }}
                  id="second_page_signup"
                  className="btn btn-primary"
                  style={{ width: "100px" }}
                  onClick={this.props.handleLocalizeRequest}
                >
                  <b>Localize</b>
                </button>
              </div>
            </div>
          </div>

          <div
            className="row justify-content-center"
            style={{ marginTop: "20px", marginBottom: "20px" }}
          >
            <button
              id="second_page_back"
              className="btn btn-secondary"
              style={{ marginRight: "20px", width: "100px" }}
              onClick={this.props.handlePageChange}
            >
              <b>Back</b>
            </button>

            <button
              id="second_page_signup"
              className="btn btn-primary"
              style={{ width: "100px" }}
              onClick={this.props.handlePageChange}
            >
              <b>Signup!</b>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
