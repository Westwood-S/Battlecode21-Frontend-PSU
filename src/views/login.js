import React, { Component } from "react";
import Api from "../api";

const LoginStatus = ({ title, message }) => {
  const statusContainerStyle = {
    padding: "20px",
    width: "350px",
    margin: "40px auto",
    marginBottom: "0px",
    fontSize: "1.1em",
  };

  return (
    <div className="card" style={statusContainerStyle}>
      <b>{title}</b>
      {message}
    </div>
  );
};

const LoginButton = () => {
  return (
    <button type="submit" value="submit" className="btn btn-primary btn-block btn-fill">
      Log in
    </button>
  );
};

const FormInputField = ({ label, type, id }) => {
  return (
    <div className="col-md-12">
      <div className="form-group">
        <label>{label}</label>
        <input type={type} id={id} className="form-control" />
      </div>
    </div>
  );
};

const LoginForm = ({ onSubmit, hasError }) => {
  const loginFormStyle = {
    width: "350px",
    margin: hasError ? "20px auto" : "40px auto",
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="card" style={loginFormStyle}>
        <div className="content">
          <div className="row">
            <FormInputField label="Email" type="text" id="email" />
            <FormInputField label="Password" type="password" id="password" />
          </div>
          <LoginButton />
          <div className="clearfix" />
        </div>
      </div>
    </form>
  );
};

const LoginTitle = () => {
  const backgroundStyle = {
    height: "100vh",
    width: "100vw",
    position: "fixed",
    top: "0px",
    left: "0px",
    zIndex: "-1",
  };
  const textStyle = {
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
  };

  return (
    <div>
      <div className="dustBackground" style={backgroundStyle}></div>
      <h1 style={textStyle}>Battlecode 2021</h1>
      <p style={textStyle}>Log in below to participate in Battlecode 2021!</p>
    </div>
  );
};

class LoginRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: "",
      success: "",
    };

    this.handleForgotPassword = this.handleForgotPassword.bind(this);
    this.handleLoginButtonClicked = this.handleLoginButtonClicked.bind(this);
  }

  handleForgotPassword() {
    window.location.replace("/forgotPassword");
  }

  handleLoginButtonClicked(e) {
    e.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    Api.login(email, password, this.handleLoginApi);
  }

  handleLoginApi(message, success) {
    if (success) window.location.assign("/");
    else this.setState({ error: message });
  }

  render() {
    const { error, success } = this.state;
    let loginStatus = null;
    if (error) {
      loginStatus = <LoginStatus title="Error: " message={error} />;
    } else if (success) {
      loginStatus = <LoginStatus title="Success." message={success} />;
    }

    return (
      <div
        className="content"
        style={{
          height: "100vh",
          width: "100vw",
          position: "absolute",
          top: "0px",
          left: "0px",
        }}
      >
        <LoginTitle />
        {loginStatus}
        <LoginForm onSubmit={this.handleLoginButtonClicked} hasError={error} />
      </div>
    );
  }
}

export default LoginRegister;
