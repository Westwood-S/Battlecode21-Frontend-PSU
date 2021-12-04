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
		this.state = { loggedIn: false };
	}

	componentDidMount() {
		Api.loginCheck((loggedIn) => {
			this.setState({ loggedIn });
		});
	}

	logout() {
		Api.logout(() => {
			this.setState({ loggedIn: false });
			window.location.reload();
		});
		window.location.reload();
	}

	render() {
		if (this.state.loggedIn === true) {
			return (
				<ul className="nav navbar-nav navbar-right">
					<li>
						<a onClick={this.logout}>Log out</a>
					</li>
				</ul>
			);
		}
		if (this.state.loggedIn === false) {
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
