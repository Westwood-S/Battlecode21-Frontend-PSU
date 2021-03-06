import React, { Component } from 'react';
import Api from '../api';

class LoginRegister extends Component {
  state = {
    email: '',
    password: '',
    error: '',
    success: '',
  };

  forgotPassword = () => {
    window.location.replace('/forgotPassword');
  }

  callback = (message, success) => {
    if (success) {
      window.location.assign('/');
    } else {
      this.setState({
        error: message,
      });
    }
  }

  formSubmit = (e) => {
    e.preventDefault();
    this.submitLogin();
  }

  submitLogin = () => {
    const { email, password } = this.state;
    Api.login(email, password, this.callback);
  };

  changeHandler = (e) => {
    const { id } = e.target;
    const val = e.target.value;
    this.setState({ [id]: val });
  }

  render() {
    const { error, success } = this.state;

    let errorDiv = null
    if (error) {
      errorDiv = (<div
        className="card"
        style={{
          padding: '20px',
          width: '350px',
          margin: '40px auto',
          marginBottom: '0px',
          fontSize: '1.1em',
        }}
      >
        <b>Error: </b>
        {error}
      </div>)
    }

    let successDiv = null
    if (success) {
      successDiv = <div
        className="card"
        style={{
          padding: '20px',
          width: '350px',
          margin: '40px auto',
          marginBottom: '0px',
          fontSize: '1.1em',
        }}
      >
        <b>Success.</b>
        {' '}
        {success}
      </div>
    }

    let buttons = (
        <button
          type="submit"
          value="submit"
          className="btn btn-primary btn-block btn-fill"
        >
          Log in
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
          zIndex: '-1'
        }}
      ></div>
        <h1 style={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: 'white'
        }}>Battlecode 2021</h1>
        <p style={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: 'white'
        }}>Log in below to participate in Battlecode 2021!</p>
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
                    <label>Email</label>
                    <input
                      type="text"
                      id="email"
                      className="form-control"
                      onChange={this.changeHandler}
                    />
                  </div>
                </div>
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
              {/*<br />
               <a
                href={`${process.env.PUBLIC_URL}/password_forgot`}
                className="btn btn-secondary btn-block btn-fill"
              >
                Forgot Password
              </a> */}

              <div className="clearfix" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default LoginRegister;
