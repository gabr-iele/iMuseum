import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Dashboard from "../src/Component/Dashboard";
import Login from "../src/Component/Login";
import Signup from "../src/Component/Signup";
import Navbar from "../src/Navigation/Navbar";
import Landing from "./Component/Landing";

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
              <Route path="/dashboard">
                <Dashboard currentUser={this.state.currentUser}/>
              </Route>
              <Route path="/login">
                <Login currentUser={this.state.currentUser} loginHandler={this.userLoginHandler}/>
              </Route>
              <Route path="/signup">
                <Signup currentUser={this.state.currentUser} loginHandler={this.userLoginHandler}/>
              </Route>
              <Route path="/" currentUser={this.state.currentUser} >
                <Landing />
              </Route>
            </Switch>
        </Router>
      </div>
    );
  }
}
