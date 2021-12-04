import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Api from "./api";
import * as Cookies from "js-cookie";

class NLink extends Component {
	render() {
		return (
			<li>
				<NavLink {...this.props} activeStyle={{ opacity: 1, fontWeight: 800 }} />
			</li>
		);
	}
}

class SideBar extends Component {
	constructor() {
		super();
		this.state = { onTeam: false, loggedIn: false, user: {}, league: {} };
	}

	componentDidMount() {
		Api.loginCheck((loggedIn) => {
			this.setState({ loggedIn });
		});
		Api.getUserTeam(
			function (e) {
				this.setState({ onTeam: e !== null });
			}.bind(this)
		);
		if (Cookies.get("teamName") === "" && Cookies.get("teamKey") === "") {
			this.setState({ onTeam: false });
		}
	}

	isSubmissionEnabled() {
		if (this.state.user.isStaff === true) {
			return true;
		}
		if (this.state.league.game_released === true) {
			return true;
		}
		return true;
	}

	// for icon options below, see https://themes-pixeden.com/font-demos/7-stroke/
	render() {
		return (
			<div className="sidebar" data-color="dust">
				{" "}
				{/* data-color is defined in light-bootstrap-dashboard.css */}
				<div className="sidebar-wrapper">
					<div className="logo">
						<a href="/">
							<img alt="logo" src="../assets/img/logo.png" />
						</a>
						<p>Battlecode 2021</p>
					</div>
					<ul className="nav nav-pills nav-stacked">
						<NLink to={`#`} style={{ visibility: "hidden" }}></NLink>
						<NLink to={`${process.env.PUBLIC_URL}/home`}>
							<p style={{ fontWeight: "inherit", textTransform: "none", fontSize: "inherit" }}>
								<i className="pe-7s-home pe-fw" />
								Home
							</p>
						</NLink>
						<NLink to={`${process.env.PUBLIC_URL}/getting-started`}>
							<p style={{ fontWeight: "inherit", textTransform: "none", fontSize: "inherit" }}>
								<i className="pe-7s-sun pe-fw" />
								Getting Started
							</p>
						</NLink>
						<NLink to={`${process.env.PUBLIC_URL}/resources`}>
							<p style={{ fontWeight: "inherit", textTransform: "none", fontSize: "inherit" }}>
								<i className="pe-7s-note2 pe-fw" />
								Resources
							</p>
						</NLink>
						<NLink to={`${process.env.PUBLIC_URL}/tournaments`}>
							<p style={{ fontWeight: "inherit", textTransform: "none", fontSize: "inherit" }}>
								<i className="pe-7s-medal pe-fw" />
								Tournaments
							</p>
						</NLink>
						{this.state.loggedIn && (
							<NLink to={`${process.env.PUBLIC_URL}/team`}>
								<p style={{ fontWeight: "inherit", textTransform: "none", fontSize: "inherit" }}>
									<i className="pe-7s-users pe-fw" />
									Team
								</p>
							</NLink>
						)}
						<NLink to={`${process.env.PUBLIC_URL}/rankings`}>
							<p style={{ fontWeight: "inherit", textTransform: "none", fontSize: "inherit" }}>
								<i className="pe-7s-graph1 pe-fw" />
								Rankings
							</p>
						</NLink>
						{this.state.onTeam && (
							<NLink to={`${process.env.PUBLIC_URL}/submissions`}>
								<p style={{ fontWeight: "inherit", textTransform: "none", fontSize: "inherit" }}>
									<i className="pe-7s-up-arrow pe-fw" />
									Submissions
								</p>
							</NLink>
						)}
						{this.state.onTeam && this.isSubmissionEnabled() && (
							<NLink to={`${process.env.PUBLIC_URL}/scrimmaging`}>
								<p style={{ fontWeight: "inherit", textTransform: "none", fontSize: "inherit" }}>
									<i className="pe-7s-joy pe-fw" />
									Scrimmaging
								</p>
							</NLink>
						)}
						<br />
						{this.state.user.isStaff && (
							<NLink to={`${process.env.PUBLIC_URL}/staff`}>
								<p style={{ fontWeight: "inherit", textTransform: "none", fontSize: "inherit" }}>
									<i className="pe-7s-tools pe-fw" />
									Staff
								</p>
							</NLink>
						)}
						<br />
					</ul>
				</div>
			</div>
		);
	}
}

export default SideBar;
