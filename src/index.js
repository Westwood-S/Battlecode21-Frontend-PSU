import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Switch, Route } from "react-router";
import Home from "./views/home";
import NotFound from "./views/not_found";
import GettingStarted from "./views/getting-started";
import Scrimmaging from "./views/scrimmaging";
import Tournaments from "./views/tournaments";
import Search from "./views/search";
import Team from "./views/team";
import Issues from "./views/issues";
import Debugging from "./views/debugging";
import CodeOfConduct from "./views/codeofconduct";
import Rankings from "./views/rankings";
import Account from "./views/account";
import Resources from "./views/resources";
import LoginRegister from "./views/login";
import Register from "./views/register";
import PasswordForgot from "./views/passwordForgot";
import PasswordChange from "./views/passwordChange";
import Submissions from "./views/submissions";
import TeamInfo from "./views/teamInfo";
import Footer from "./footer";
import NavBar from "./navbar";
import SideBar from "./sidebar";
import Api from "./api";

class App extends Component {
	constructor() {
		super();
		this.state = { loggedIn: false };
	}

	componentDidMount() {
		Api.loginCheck((loggedIn) => {
			this.setState({ loggedIn });
		});
	}

	render() {
		//TODO: update home page to my domain
		//direct to home page, should always be visible
		let homeElems = [
			<Route exact path={`${process.env.PUBLIC_URL}/`} component={Home} />,
			<Route path={`${process.env.PUBLIC_URL}/home`} component={Home} />,
		];

		// should only be visible to logged in users
		let loggedInElems = [];
		if (this.state.loggedIn) {
			loggedInElems = [
				<Route path={`${process.env.PUBLIC_URL}/team`} component={Team} />,
				<Route path={`${process.env.PUBLIC_URL}/account`} component={Account} />,
				<Route path={`${process.env.PUBLIC_URL}/password_forgot`} component={Home} />,
				<Route path={`${process.env.PUBLIC_URL}/password_change`} component={Home} />,
				<Route path={`${process.env.PUBLIC_URL}/login`} component={Home} />,
				<Route path={`${process.env.PUBLIC_URL}/scrimmaging`} component={Scrimmaging} />,
				<Route path={`${process.env.PUBLIC_URL}/submissions`} component={Submissions} />,
				<Route path={`${process.env.PUBLIC_URL}/register`} component={Home} />,
			];
		}

		// should be visible to all users
		let nonLoggedInElems = [
			<Route path={`${process.env.PUBLIC_URL}/search`} component={Search} />,
			<Route path={`${process.env.PUBLIC_URL}/tournaments`} component={Tournaments} />,
			<Route path={`${process.env.PUBLIC_URL}/getting-started`} component={GettingStarted} />,
			<Route path={`${process.env.PUBLIC_URL}/common-issues`} component={Issues} />,
			<Route path={`${process.env.PUBLIC_URL}/debugging`} component={Debugging} />,
			<Route path={`${process.env.PUBLIC_URL}/codeofconduct`} component={CodeOfConduct} />,
			<Route path={`${process.env.PUBLIC_URL}/resources`} component={Resources} />,
			<Route path={`${process.env.PUBLIC_URL}/rankings/:team_id`} component={TeamInfo} />,
			<Route path={`${process.env.PUBLIC_URL}/rankings`} component={Rankings} />,
			<Route path="*" component={NotFound} />,
		];

		return (
			<div className="wrapper">
				<SideBar />
				<div className="main-panel">
					<NavBar />
					<Switch>
						{homeElems}
						{loggedInElems}
						{nonLoggedInElems}
					</Switch>
					<Footer />
				</div>
			</div>
		);
	}
}

class BeforeLoginApp extends Component {
	constructor() {
		super();
		this.state = { loggedIn: false };
	}

	componentDidMount() {
		Api.loginCheck((loggedIn) => {
			this.setState({ loggedIn });
		});
	}

	render() {
		if (this.state.loggedIn) {
			return <App />;
		}
		if (this.state.loggedIn === false) {
			return (
				<Switch>
					<Route path={`${process.env.PUBLIC_URL}/password_forgot`} component={PasswordForgot} />
					<Route path={`${process.env.PUBLIC_URL}/password_change`} component={PasswordChange} />
					<Route path={`${process.env.PUBLIC_URL}/login`} component={LoginRegister} />
					<Route path={`${process.env.PUBLIC_URL}/register`} component={Register} />
					<Route path={`${process.env.PUBLIC_URL}/team`} component={LoginRegister} />,
					<Route path={`${process.env.PUBLIC_URL}/account`} component={LoginRegister} />
					<Route path="*" component={App} />
				</Switch>
			);
		}
		return <div />;
	}
}

ReactDOM.render(
	<BrowserRouter>
		<BeforeLoginApp />
	</BrowserRouter>,
	document.getElementById("root")
);
