
import React, { Component } from 'react';
import global from "../global.json";
import System from "../System/System";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';

import {
    faSignInAlt
} from "@fortawesome/free-solid-svg-icons";


/**
 * Navigation bar of the website
 * @author Giulio Serra
 */
export default class Navbar extends Component {

    /**
     * Returns the left element of the navbar
    * @author Giulio Serra
    */
    getNavbarRightElement() {
        if (System.prototype.isObjectEmpty(this.props.currentUser)) {
            return <Link to={"/login"} style={{ textDecoration: "none" }}>
                
            <FontAwesomeIcon
                    icon={faSignInAlt}
                    color={global.GUI.WHITE}
                    size="lg"
                />
            </Link>
        } else {
            return <div>...</div>
        }
    }

    render() {
        return (<nav
            className="navbar navbar fixed-top navbar-expand-lg navbar-light"
            style={{
                background: global.GUI.RED,

                boxShadow:
                    "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
            }}
        >
            <a
                className="navbar-brand"
                href="index.html"
                style={{ marginLeft: "25px", color: global.GUI.WHITE, }}
            >
                <b> iMuseum</b>
            </a>

            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    {this.getNavbarRightElement()}
                </li>
            </ul>
        </nav>
        );
    }
}