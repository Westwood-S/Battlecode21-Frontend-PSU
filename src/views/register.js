import React, { Component } from 'react';
import Api from '../api';

class Register extends Component {
  state = {
    email: '',
    password: '',
    username: '',
    first: '',
    last: '',
    register: false,
    error: '',
    success: '',
  };

  forgotPassword = () => {
    window.location.replace('/forgotPassword');
  };

  callback = (message, success) => {
    if (success) {
      window.location.assign('/');
    } else {
      console.log(message);
      this.setState({
        error: message,
      });
    }
  };

  formSubmit = (e) => {
    console.log('HI!');
    e.preventDefault();
    this.submitRegister();
  };

  submitLogin = () => {
    const { email, password } = this.state;
    Api.login(email, password, this.callback);
  };

  submitRegister = () => {
    const { email, first, last, password } = this.state;
    // ensure that all fields are correct
    if (email.indexOf('@') == -1)
      this.setState({ error: 'Email should contain @' });
    else if (!first) this.setState({ error: 'Should provide first name.' });
    else if (!last) this.setState({ error: 'Should provide last name.' });
    else if (password.length < 6)
      this.setState({ error: 'Password must be at least 6 characters.' });
    else {
      Api.register(email, password, first, last, this.callback);
    }
  };

  changeHandler = (e) => {
    const { id } = e.target;
    const val = e.target.value;
    this.setState({ [id]: val });
  };

  render() {
    const { error, success, register } = this.state;

    const errorDiv = error && (
      <div
        className="card"
        style={{
          padding: '20px',
          width: '350px',
          margin: '40px auto',
          marginBottom: '0px',
          fontSize: '1.1em',
        }}
      >
        <b>Error. </b>
        {error}
      </div>
    );

    const successDiv = success && (
      <div
        className="card"
        style={{
          padding: '20px',
          width: '350px',
          margin: '40px auto',
          marginBottom: '0px',
          fontSize: '1.1em',
        }}
      >
        <b>Success.</b> {success}
      </div>
    );

    let buttons = (
      <button
        type="submit"
        value="submit"
        className="btn btn-primary btn-block btn-fill"
      >
        Register
      </button>
    );

    return (
      <div
        className="content"
        style={{
          height: '100vh',
          width: '100vw',
          position: 'absolute',
          top: '0px',
          left: '0px',
        }}
      >
        <div
          className="dustBackground"
          style={{
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            top: '0px',
            left: '0px',
            zIndex: '-1',
          }}
        ></div>
        <h1
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          Battlecode 2021
        </h1>
        <p
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          Register below to participate in Battlecode 2021 PSUer!
        </p>
        {errorDiv}
        {successDiv}
        <form onSubmit={this.formSubmit}>
          <div
            className="card"
            style={{
              width: '350px',
              margin: error ? '20px auto' : '40px auto',
            }}
          >
            <div className="content">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>PDX Email</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      onChange={this.changeHandler}
                    />
                  </div>
                  <div class="clearfix"></div>
                </div>
                <div className="col-xs-6">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      id="first"
                      className="form-control"
                      onChange={this.changeHandler}
                    />
                  </div>
                </div>
                <div className="col-xs-6">
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      id="last"
                      className="form-control"
                      onChange={this.changeHandler}
                    />
                  </div>
                </div>
                <div class="clearfix"></div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      onChange={this.changeHandler}
                    />
                  </div>
                </div>
              </div>
              {buttons}

              <div className="clearfix" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Register;
