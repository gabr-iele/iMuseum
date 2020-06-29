
import React, { Component } from 'react';
import global from "../global.json";
import { Redirect } from 'react-router-dom'

import Firebase from "../Firebase/Firebase";
import Storage from "../PersistanceStorage/PersistanceStorage";
import System from '../System/System';

/**
 * Component to login inside the service
 * @author Giulio Serra 
 */
export default class Login extends Component {

  constructor(props) {
    super(props);

    this.state = { redirect: { shouldRedirect: false, to: "/signup" } };

    this.handleLoginAsync = this.handleLoginAsync.bind(this);
    this.handleRegistrationAsync = this.handleRegistrationAsync.bind(this);
  }

  componentDidMount(){
    // if there is a session running it close it
    this.props.loginHandler({});
    Firebase.prototype.closeSessionAsync();

  }

  /**
  * Handle the login operations 
  * @author Giulio Serra 
  */
  handleLoginAsync(e) {
    e.preventDefault();
    const email = document.getElementById('email_field').value;
    const password = document.getElementById('password_field').value;

    console.log({ email: email, password: password })
    if (email === "") {
      alert("You must specify a valid email!")
      return;
    }

    if (password === "") {
      alert("You must specify a valid password!")
      return;
    }

    Firebase.prototype.signInWithEmailAndPassword(email, password).then(response => {
      const userID = response.user.uid;
      Storage.prototype.getCuratorAsync(userID).then(response=>{
        const curator = response.data.data;

        if(System.prototype.isObjectEmpty(curator)){
          alert("User not found, please check your credential.");
          return;
        }

        this.props.loginHandler(curator);
        this.setState({
          refreshing: false,
          redirect: {
            shouldRedirect: true,
            to: "/dashboard"
          }})
      })

    }).catch(err => {
      alert(err.message);
      return;
    })
  }

  /**
  * Handle the registration operations
  * @author Giulio Serra 
  */
  handleRegistrationAsync(e) {
    e.preventDefault();
    this.setState({redirect: { shouldRedirect: true, to: "/signup" } })
  }

  /**
  * Create the login box
  * @author Giulio Serra 
  */
  getLoginBox() {
    const stackLogin = {
      background: "#ffffff",
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      borderBottomLeftRadius: 5,
      borderTopLeftRadius: 5,
      borderBottomRightRadius: 5,
      borderTopRightRadius: 5,
      margin: 10
    };

    return (

      <div className="container" style={stackLogin}>
        <div className="row justify-content-center" style={{ marginBottom: "20px", marginTop: "20px", color: global.GUI.RED, fontSize: "30px" }}>
          <b>iMuseum</b>
        </div>


        <div
          className="row justify-content-center"
          style={{
            alignContent: "center"
          }}
        >
          <input
            style={{ width: 240 }}
            type="email"
            className="form-control"
            aria-describedby="emailHelp"
            placeholder="Email"
            name="email"
            id="email_field"
          />
        </div>

        <div
          className="row justify-content-center"
        >
          <input
            style={{ width: 240, marginTop: 10 }}
            type="password"
            className="form-control"
            aria-describedby="emailHelp"
            placeholder="Password"
            id="password_field"
          />
        </div>

        <div className="row justify-content-center">
          <button
            className="btn btn-primary"
            style={{ width: 240, margin: 15 }}
            onClick={this.handleLoginAsync}
          >
            <b>Login</b>
          </button>
        </div>


        <div className="row justify-content-center">
          <button className="btn btn-secondary"
            style={{ width: 240, margin: 15  }}
            onClick={this.handleRegistrationAsync}
          >
           Don't have an account yet? Signup!
          </button>
        </div>


      </div>
    );
  }

  render() {

    if (this.state.redirect.shouldRedirect) {
      return <Redirect
          to={{
              pathname: this.state.redirect.to
          }}
      />
  }

    return (
      <form>
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh"
          }}
        >
          <div className="row justify-content-center">{this.getLoginBox()}</div>
        </div>

      </form>
    );
  }
}