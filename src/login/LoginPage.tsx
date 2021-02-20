import React from "react";
import "./style.css";
import googleLogo from "./google.svg";
import logo from "./logo.png";
import { authorize } from "../api/firebase";

class LoginPage extends React.Component {
  state = {
    isSigningIn: false,
  };

  onClick = () => {
    this.setState({ isSigningIn: true });
    authorize()
      .then((res: {}) => {
        console.log(res);
        this.setState({ isSigningIn: false });
      })
      .catch((res: {}) => {
        console.log(res);
        this.setState({ isSigningIn: false });
      });
  };

  renderButton = () => (
    <>
      <button className="login-button" onClick={this.onClick}>
        <img className="login_google-logo" src={googleLogo} alt="" /> Sign in
        with Google
      </button>
      <small className="login-text">
        You will be registered automagically if needed
      </small>
    </>
  );

  renderLoading = () => (
    <>
      <div className="lds-ripple center">
        <div></div>
        <div></div>
      </div>
      <div className="google-wait-text">Waiting for Google popup</div>
    </>
  );

  render() {
    return (
      <div className="login-container dark-colors">
        <div className="login-form">
          <img className="login-logo logo" src={logo} alt="" />
          {this.state.isSigningIn ? this.renderLoading() : this.renderButton()}
        </div>
      </div>
    );
  }
}

export default LoginPage;
