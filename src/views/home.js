import React, { Component } from "react";
import Api from "../api";
import Countdown from "./countdown";
import UpdateCard from "../components/updateCard";
import ChartistGraph from "react-chartist";

class StatCard extends React.Component {
	constructor() {
		super();
		this.state = {
			series: [0, 0],
		};
	}

	componentDidMount() {
		Api.getTeamWinStats(
			function (stats) {
				this.setState({ series: stats });
			}.bind(this)
		);
	}

	render() {
		var data = {
			series: [this.state.series[0], this.state.series[1]],
		};
		var options = {
			donut: false,
		};
		var type = "Pie";

		return (
			<div className="card">
				<div className="header">
					<h4 className="title">Match Statistics</h4>
					<p className="category">Wins and losses pie chart.</p>
				</div>
				<div className="content" style={{ minHeight: "340px" }}>
					<ChartistGraph data={data} options={options} type={type} />
					<div className="footer">
						<div className="legend">
							<i className="fa fa-circle text-info" /> Win
							<span style={{ marginLeft: "10px" }}> </span>
							<i className="fa fa-circle text-danger" /> Loss
						</div>
					</div>
				</div>
			</div>
		);
	}
}

class DateCard extends UpdateCard {
	render() {
		return (
			<div className="card" style={{ minHeight: "355px" }}>
				<div className="header">
					<h4 className="title">Recent Updates</h4>
				</div>
				<div className="content">
					<div className="table-full-width">
						<table className="table">
							<tbody>
								<tr>
									<td>Oct 3rd</td>
									<td>
										<b>PDX_SE_BATTLECODE</b> ver 1.0 released!
										<br />
										Bugs 🐞 will eventually happen. I'm more than glad to fix them. 🛠️ <br />
										You can email <a href="mailto:cecishi@pdx.edu">cecishi@pdx.edu</a> to tell me your thoughts.
									</td>
								</tr>
								<tr>
									<td>Oct 20th</td>
									<td>
										<b>Server Updates:</b>
										<ul>
											<li>Upgraded virtual machine instances with more CPU cores, memory and disk storage.</li>
											<li>Increased scrimmage's running frequency.</li>
											<li>
												Changed compile server's user story from "accept all robots as long as they can run" to "reject
												all robots unless after it runs the stderr is empty". <br />
												(debatable, we'll see if I should change it)
											</li>
											<li>Updated instructions on the submissions page.</li>
											<li>Changed server timezone to America/Los_Angeles.</li>
										</ul>
									</td>
								</tr>
								<tr>
									<td>Nov 4th</td>
									<td>
										<b>Server Updates:</b>
										<ul>
											<li>
												Battlecode doesn't support two engines (scrimmage and submission) to run at the same time. If it
												happenes during submission, the callback message will say: "scrimmage engine running, try again
												later". It would be great if you can try again 5 minutes later.
											</li>
											<li>
												Q: What does "queuing" mean? A: The server supports multiple submissions at the same time. If
												there's any submission is ahead of you, your submission will be waiting in a queue until it's
												your turn.
											</li>
											<li>Downgrade virtual machine instances because of billing.</li>
										</ul>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}
}

class InstrCard extends UpdateCard {
	constructor() {
		super();
		this.state.dates = [];
	}

	render() {
		return (
			<div className="card ">
				<div className="header">
					<h4 className="title">Welcome to Battlecode 2021!</h4>
				</div>
				<div className="content">
					<p>
						Let's Talk Politics!{" "}
						<span role="img" aria-label="emoji">
							👨‍💼🐘🐴
						</span>{" "}
						Check out the <a href="/getting-started">Getting Started</a> page for instructions.
					</p>
				</div>
				<div className="header">
					<h4 className="title">Useful Links</h4>
				</div>
				<div className="content">
					<p>
						<ul>
							<li>
								<a
									target="_blank"
									rel="noopener noreferrer"
									href="https://discordapp.com/channels/386965718572466197/650084292982079539"
								>
									Discord
								</a>{" "}
								(
								<a target="_blank" rel="noopener noreferrer" href="https://discord.gg/N86mxkH">
									invite
								</a>
								)
							</li>
							<li>
								<a target="_blank" rel="noopener noreferrer" href="https://github.com/battlecode/battlecode21">
									GitHub
								</a>
							</li>
							<li>
								<a target="_blank" rel="noopener noreferrer" href="https://twitch.tv/mitbattlecode">
									Twitch
								</a>
							</li>
							<li>
								<a target="_blank" rel="noopener noreferrer" href="https://battlecode.org">
									Battlecode.org
								</a>
							</li>
						</ul>
					</p>
				</div>
			</div>
		);
	}
}

class Home extends Component {
	constructor() {
		super();
		this.state = { onTeam: null };
	}

	componentDidMount() {
		Api.getUserTeam(
			function (e) {
				this.setState({ onTeam: e !== null });
			}.bind(this)
		);
	}

	render() {
		return (
			<div className="content">
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-6">
							<div className="container-fluid">
								<div className="row">
									<InstrCard />
									{this.state.onTeam && <StatCard />}
								</div>
							</div>
						</div>
						<div className="col-md-6">
							<div className="container-fluid">
								<Countdown />
								<DateCard />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
