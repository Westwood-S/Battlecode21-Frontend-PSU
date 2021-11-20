import React from "react";
import UpdateCard from "./updateCard";

class PerfCard extends UpdateCard {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="card">
				<div className="header">
					<h4 className="title">Performance</h4>
					<p className="category">Skill estimation over time.</p>
				</div>
				<div className="content">
					<div id="mu_chart" className="ct-chart" />
					{this.getFooter()}
				</div>
			</div>
		);
	}
}

export default PerfCard;
