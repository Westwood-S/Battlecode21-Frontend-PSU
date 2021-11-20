import React, { Component } from "react";
import Api from "../api";
import RankingTeamList from "../components/rankingTeamList";

class ScrimmageRequestor extends Component {
	state = {
		autocompleteOptions: [],
		teams: null,
		teamLimit: 0,
		teamPage: 1,
		input: "",
	};

	onDataLoad = (data) => {
		this.setState(data);
	};

	onPageClick = (page) => {
		const { state } = this;
		if (page !== state.teamPage && page >= 0 && page <= state.teamLimit) {
			Api.searchTeam(state.input, page, this.onDataLoad);
		}
	};

	render() {
		const { state, props } = this;

		return (
			<div>
				<div className="col-md-12">
					<RankingTeamList
						teams={state.teams}
						page={state.teamPage}
						pageLimit={state.teamLimit}
						onPageClick={this.onPageClick}
						canRequest={true}
						onRequestSuccess={props.refresh}
					/>
				</div>
			</div>
		);
	}
}

export default ScrimmageRequestor;