import React, { Component } from "react";
import Avatar from "../components/avatar";

class TeamCard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			users: [],
		};
	}

	setupUsers() {
		const dummyArr = [];
		this.props.team.users.forEach((user) => {
			dummyArr.push({ username: user });
		});

		this.setState({ users: dummyArr });
	}

	componentDidUpdate() {
		if (this.state.users.length === 0 && this.props.team.users) {
			this.setupUsers();
		}
	}

	returnUserName() {
		return (
			<div>
				{this.state.users.map((user) => (
					<div className="small-user-list" key={user.username}>
						<small>{user.username}</small>
					</div>
				))}
			</div>
		);
	}

	render() {
		const team = this.props.team;
		this.state.users.map((user) => {
			return (
				<div className="small-user-list" key={user.username}>
					<small>{user.username}</small>
				</div>
			);
		});

		return (
			<div className="card card-user">
				<div className="image"></div>
				<div className="content" style={{ minHeight: "236px" }}>
					<div className="author">
						<Avatar data={team} />
						<h4 className="title">
							{team.name}
							<br />
							<div className="row-items-box">{this.returnUserName()}</div>
						</h4>
					</div>
					<br />
					<p className="description text-center">{team.bio}</p>
				</div>
			</div>
		);
	}
}

export default TeamCard;
