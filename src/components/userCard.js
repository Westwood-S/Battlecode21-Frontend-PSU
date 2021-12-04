import React, { Component } from "react";

class UserCard extends Component {
	render() {
		const user = this.props.user;
		const staffMsg = user.isStaff ? (
			<small>
				{" "}
				| <label>Staff</label>
			</small>
		) : null;
		return (
			<div className="card card-user">
				<div className="image"></div>
				<div className="content">
					<div className="author">
						<h4 className="title">
							{user.firstName + " " + user.lastName}
							<br />
							<small>{user.username}</small> {staffMsg}{" "}
						</h4>
					</div>
					<br />
					<p className="description text-center">{user.bio}</p>
				</div>
			</div>
		);
	}
}

export default UserCard;
