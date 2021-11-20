import React, { Component } from "react";
import Api from "../api";
import RankingTeamList from "../components/rankingTeamList";

class Rankings extends Component {
	state = {
		teams: null,
	};

	componentDidMount() {
		Api.getAllTeam(this.onDataLoad);
		Api.calculateElo();
	}

	onDataLoad = (data) => {
		this.setState(data);
	};

	render() {
		const { state } = this;
		return (
			<div className="content">
				<div className="container-fluid row">
					<div className="col-md-12">
						<RankingTeamList teams={state.teams} />
					</div>
				</div>
			</div>
		);
	}
}

export default Rankings;
