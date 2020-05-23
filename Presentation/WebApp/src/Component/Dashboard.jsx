
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'

import System from "../System/System";

/**
 * Class to display to a user the dashboard of his/her museum
 * @author Giulio Serra 
 */
export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = { redirect: { shouldRedirect: false, to: "/login" } };

    }

    render() {

        if (this.state.redirect.shouldRedirect) {
            return <Redirect
                to={{
                    pathname: this.state.redirect.to
                }}
            />
        }

        if (System.prototype.isObjectEmpty(this.props.currentUser)) {
            this.setState({ redirect: { shouldRedirect: true, to: "/login" } });
        }
        
        return <div style={{ marginTop: "70px" }}>Hello,From Dashboard! </div>
    }
}