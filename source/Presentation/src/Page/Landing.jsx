import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'

/**
 * Empty component for landing
 * @author Giulio Serra 
 */
export default class Landing extends Component {

    constructor(props) {
        super(props);
        this.state = { redirect: { shouldRedirect: true, to: "/dashboard" } };

    }

    render() {

        if (this.state.redirect.shouldRedirect) {
            return <Redirect
                to={{
                    pathname: this.state.redirect.to
                }}
            />
        }

        return <div></div>
    }

}