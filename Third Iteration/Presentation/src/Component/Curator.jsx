import React, { Component } from "react";
import global from "../global.json"

import placeholder from "../../src/resource/placeholder.png"

/**
 * Component to create a curator
 * @author Giulio Serra
 */
export default class Curator extends Component {
  
  render() {

    const curatorImage = (this.props.newCurator.immageFile !== undefined) ?
    URL.createObjectURL(this.props.newCurator.immageFile) : placeholder

    const divStyle = {
      background: "#ffffff",
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      borderBottomLeftRadius: 5,
      borderTopLeftRadius: 5,
      borderBottomRightRadius: 5,
      borderTopRightRadius: 5,
      margin: 10,
    };

    return (
      <div className="container" style={divStyle}>
        <div
          className="row justify-content-center"
          style={{
            marginBottom: "20px",
            marginTop: "20px",
            color: global.GUI.RED,
            fontSize: "30px",
          }}
        >
          <div
            className="col justify-content-center"
            style={{
              alignContent: "center",
            }}
          >
            <center>
              <img
                className="rounded-circle"
                style={{ height: "200px", width: "200px", objectFit: "cover" }}
                id="profile_img"
                alt="curator_profile_img"
                src={curatorImage}
                onClick={this.props.handleUploadImmageRequest}
              />
              <input id="profile_picker" type="file" hidden />
            </center>

            <div style={{ fontSize: "20px", marginTop: "20px" }}>
              <b>Tell us something about you!</b>
            </div>

            <input
              style={{ marginTop: 10 }}
              className="form-control"
              placeholder="Name"
              value={this.props.newCurator.name}
              onChange={this.props.handleTextInput}
              id="name_field"
            />

            <input
              style={{ marginTop: 10 }}
              className="form-control"
              placeholder="Surname"
              value={this.props.newCurator.surname}
              onChange={this.props.handleTextInput}
              id="surname_field"
            />

            <input
              style={{ marginTop: 10 }}
              type="email"
              className="form-control"
              aria-describedby="emailHelp"
              placeholder="Email"
              value={this.props.newCurator.credentialWrapper.email}
              onChange={this.props.handleTextInput}
              id="email_field"
            />

            <input
              style={{ marginTop: 10 }}
              type="password"
              className="form-control"
              placeholder="Password"
              onChange={this.props.handleTextInput}
              value={this.props.newCurator.credentialWrapper.password}
              id="password_field"
            />

            <input
              style={{ marginTop: 10 }}
              type="password"
              className="form-control"
              placeholder="Repeate Password"
              onChange={this.props.handleTextInput}
              value={this.props.newCurator.credentialWrapper.repeatPassword}
              id="repeat_password_field"
            />

            <div className="row justify-content-center" id="first_page_next">
              <button
                id="first_page_next"
                className="btn btn-primary"
                style={{ marginTop: 20, width: "90%" }}
                onClick={this.props.handlePageChange}
              >
                <b>Next</b>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
