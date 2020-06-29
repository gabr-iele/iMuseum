import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Dashboard from "../src/Page/Dashboard";
import Login from "../src/Page/Login";
import Signup from "../src/Page/Signup";
import Navbar from "../src/Navigation/Navbar";
import Landing from "./Page/Landing";

export default class App extends Component {
  state = {
    currentUser: {}, // current user of the application
  };

  constructor(props) {
    super(props);
    this.userLoginHandler = this.userLoginHandler.bind(this);
  }


  userLoginHandler(user){
    console.log(user);
    this.setState({currentUser:user});
    console.log("new user logged in..")
  
  }

  render() {
    return (
      <div>
        <Router>
          <Navbar currentUser={this.state.currentUser} />
          <Switch>
              <Route exactly path="/dashboard">
                <Dashboard currentUser={this.state.currentUser}/>
              </Route>
              <Route exactly path="/login">
                <Login currentUser={this.state.currentUser} loginHandler={this.userLoginHandler}/>
              </Route>
              <Route exactly path="/signup">
                <Signup currentUser={this.state.currentUser} loginHandler={this.userLoginHandler}/>
              </Route>
              <Route exactly path="/" currentUser={this.state.currentUser} >
                <Landing />
              </Route>
            </Switch>
        </Router>
      </div>
    );
  }
}
