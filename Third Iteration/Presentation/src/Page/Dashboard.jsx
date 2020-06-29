import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import global from "../global.json";
import Curator from "../Model/Curator";

import System from "../System/System";
import Museum from "../Model/Museum";

import Crowd from "../Component/Crowd";
import Pieces from "../Component/Pieces";
import Visits from "../Component/Visits";

/**
 * Class to display to a user the dashboard of his/her museum
 * @author Giulio Serra
 */
export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: { shouldRedirect: false, to: "/login" },
      currentMuseum: {},
      pagePadding:"50px"
    };
  }

  /**
   * Generate the component to display a museum with all the informations
   * @author Giulio Serra
   */
  generateCurrentMuseumComponent() {
    const divStyle = {
      background: "#ffffff",
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      borderBottomLeftRadius: 5,
      borderTopLeftRadius: 5,
      borderBottomRightRadius: 5,
      borderTopRightRadius: 5,
      marginBottom: "50px",
      paddingLeft: "0px",
      paddingRight: "0px",
      overflow: "hidden",
    };

    const currentCurator = this.props.currentUser;
    const obj_Curator = new Curator(
      System.prototype.getJsonFromKeyValueForm(currentCurator)
    );

    if (System.prototype.isObjectEmpty(this.state.currentMuseum)) {
      this.setState({ currentMuseum: obj_Curator.getDefaultMuseum() });
    }

    const j_currentMuseum = System.prototype.getJsonFromKeyValueForm(
      this.state.currentMuseum
    );
    const obj_currentMuseum = new Museum(j_currentMuseum);

    return (
      <div>
        <div
          className="container"
          style={{
            marginTop:"200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div className="row">
            <div className="container" style={divStyle}>
              <div
                className="col"
                style={{
                  paddingLeft: "0",
                  paddingRight: "0px",
                  color: global.GUI.RED,
                }}
              >
                <img
                  style={{
                    maxHeight: "400px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                  id="museum_img"
                  alt="museum_img"
                  src={obj_currentMuseum.getImmage()}
                />

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <b>{obj_currentMuseum.getOpeningDescription()}</b>
                </div>

                <div>
                  <ul
                    className="nav nav-tabs justify-content-center"
                    id="myTab"
                    role="tablist"
                    style={{ marginTop: "2%" }}
                  >
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        id="visits-tab"
                        data-toggle="tab"
                        href="#visits"
                        role="tab"
                        aria-selected="true"
                      >
                        Visits
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        id="crowd-tab"
                        data-toggle="tab"
                        href="#crowd"
                        role="tab"
                        aria-selected="false"
                      >
                        Crowd Sensing
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        id="pieces-tab"
                        data-toggle="tab"
                        href="#pieces"
                        role="tab"
                        aria-selected="false"
                      >
                        Pieces
                      </a>
                    </li>
                  </ul>
                  <div
                    className="tab-content justify-content-center"
                    style={{ marginBottom: "2%" }}
                  >
                    <div
                      className="tab-pane active"
                      id="visits"
                      role="tabpanel"
                      aria-labelledby="visits-tab"
                    >
                      <Visits museum={this.state.currentMuseum}/>
                    </div>
                    <div
                      className="tab-pane"
                      id="crowd"
                      role="tabpanel"
                      aria-labelledby="crowd-tab"
                    >
                      <Crowd museum={this.state.currentMuseum}/>
                    </div>
                    <div
                      className="tab-pane"
                      id="pieces"
                      role="tabpanel"
                      aria-labelledby="pieces-tab"
                    >
                      <Pieces museum={this.state.currentMuseum}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.redirect.shouldRedirect) {
      return (
        <Redirect
          to={{
            pathname: this.state.redirect.to,
          }}
        />
      );
    }

    if (System.prototype.isObjectEmpty(this.props.currentUser)) {
      this.setState({ redirect: { shouldRedirect: true, to: "/login" } });
    }

    return (
      <div style={{paddingTop:this.state.pagePadding}}>
        {this.generateCurrentMuseumComponent()}
      </div>
    );
  }
}
