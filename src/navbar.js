import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Api from "./api";

class NavBar extends Component {
	toggleNavigation() {
		window.click_toggle();
	}

	render() {
		return (
			<nav className="navbar navbar-default navbar-fixed">
				<div className="container-fluid">
					<div className="navbar-header">
						<NavLink className="navbar-brand" to={`${process.env.PUBLIC_URL}/home`}>
							Battlecode 2021
						</NavLink>
					</div>
					<div className="collapse navbar-collapse">
						<NavBarAccount />
					</div>
				</div>
			</nav>
		);
	}
}

class NavBarAccount extends Component {
	constructor() {
		super();
		this.state = { logged_in: false };
	}

	componentDidMount() {
		Api.loginCheck((logged_in) => {
			this.setState({ logged_in });
		});
	}

	logout() {
		Api.logout(() => {
			this.setState({ logged_in: false });
			window.location.reload();
		});
		window.location.reload();
	}

	render() {
		if (this.state.logged_in === true) {
			return (
				<ul className="nav navbar-nav navbar-right">
					<li>
						<a onClick={this.logout}>Log out</a>
					</li>
				</ul>
			);
		}
		if (this.state.logged_in === false) {
			return (
				<ul className="nav navbar-nav navbar-right">
					<li>
						<NavLink to={`${process.env.PUBLIC_URL}/register`}>Register</NavLink>
					</li>
					<li>
						<NavLink to={`${process.env.PUBLIC_URL}/login`}>Log in</NavLink>
					</li>
				</ul>
			);
		}
		return <ul />;
	}
}

export default NavBar;
