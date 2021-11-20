import React from "react";
import TeamList from "./teamList";
import PaginationControl from "./paginationControl";

class RankingTeamList extends TeamList {
	render() {
		const { props } = this;

		if (!props.teams) {
			return null;
		} else if (props.teams.length === 0) {
			return (
				<div className="card">
					<div className="header">
						<h4 className="title">No Teams Found!</h4>
						<br />
					</div>
				</div>
			);
		} else {
			const teamRows = props.teams.map((team) => {
				return (
					<tr key={team.id}>
						<td>{team.score === -1000000 ? "N/A" : Math.round(team.score)}</td>
						<td>{team.name}</td>
						<td>{team.users.join(", ")}</td>
					</tr>
				);
			});

			return (
				<div>
					<div className="card">
						<div className="header">
							<h4 className="title">Rankings</h4>
							<br />
							<div>
								If you're interested in how the score is calculated, see{" "}
								<a
									style={{ fontWeight: 700 }}
									target="_blank"
									rel="noopener noreferrer"
									href="https://en.wikipedia.org/wiki/Elo_rating_system#Mathematical_details"
								>
									here
								</a>
							</div>
						</div>
						<div className="content table-responsive table-full-width">
							<table className="table table-striped">
								<thead>
									<tr>
										<th>Score</th>
										<th>Team</th>
										<th>Users</th>
									</tr>
								</thead>
								<tbody>{teamRows}</tbody>
							</table>
						</div>
					</div>
					<PaginationControl page={props.page} pageLimit={props.pageLimit} onPageClick={props.onPageClick} />
				</div>
			);
		}
	}
}

export default RankingTeamList;