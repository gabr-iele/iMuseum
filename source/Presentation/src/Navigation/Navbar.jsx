import React, { Component } from "react";
import global from "../global.json";
import System from "../System/System";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";

import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import Curator from "../Model/Curator";

import "jquery/dist/jquery.min.js";
import "bootstrap/dist/js/bootstrap.min.js";

/**
 * Navigation bar of the website
 * @author Giulio Serra
 */
export default class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: {},
    };
  }

  /**
   * Display the immage of the current user
   * @author Giulio Serra
   */
  getUserImage() {
    const currentUser = System.prototype.getJsonFromKeyValueForm(
      this.state.currentUser
    );
    const obj_curator = new Curator(currentUser);

    return (
      <div className="container" style={{ marginRight: "20px" }}>
        <div className="row">
          <div
            className="column"
            style={{
              overflow: "hidden",
            }}
          >
            <img
              src={obj_curator.getImmage()}
              alt="user_img"
              style={{
                borderRadius: "50%",
                width: "38px",
                height: "38px",
                margin: "10px 10px 10px 10px",
                boxShadow: "0px 0px 5px grey",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  /**
   * Create a menu for the user
   * @author Giulio Serra
   */
  getUserMenu() {
    return (
      <div class="dropdown show">
        <div
          role="button"
          id="dropdownMenuLink"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {this.getUserImage()}
        </div>

        <div
          class="dropdown-menu dropdown-menu-right"
          aria-labelledby="dropdownMenuLink"
        >
          <Link
            style={{ textDecoration: "none", marginLeft: "20px" }}
            to="/dashboard"
          >
            Dashboard
          </Link>
          <hr className="rounded"></hr>
          <Link
            style={{ textDecoration: "none", marginLeft: "20px" }}
            to="/login"
          >
            Logout
          </Link>
        </div>
      </div>
    );
  }

  /**
   * Returns the left element of the navbar
   * @author Giulio Serra
   */
  getNavbarRightElement() {
    if (System.prototype.isObjectEmpty(this.state.currentUser)) {
      return (
        <Link to={"/login"} style={{ textDecoration: "none" }}>
          <FontAwesomeIcon
            icon={faSignInAlt}
            color={global.GUI.WHITE}
            size="lg"
          />
        </Link>
      );
    } else {
      return this.getUserMenu();
    }
  }

  componentWillReceiveProps(newProps) {
    if (
      !System.prototype.areObjectSame(
        this.state.currentUser,
        newProps.currentUser
      )
    ) {
      this.setState({ currentUser: newProps.currentUser });
    }
  }

  render() {
    return (
      <nav
        className="navbar navbar fixed-top navbar-expand-lg navbar-light"
        style={{
          background: global.GUI.RED,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          maxHeight: "70px",
        }}
      >
        <a
          className="navbar-brand"
          href="index.html"
          style={{ marginLeft: "25px", color: global.GUI.WHITE }}
        >
          <b> iMuseum</b>
        </a>

        <ul className="navbar-nav ml-auto"></ul>
        <ul className="navbar-nav">{this.getNavbarRightElement()}</ul>
      </nav>
    );
  }
}
