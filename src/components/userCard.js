import React, { Component } from "react";

class UserCard extends Component {
	render() {
		const user = this.props.user;
		const staff_msg = user.is_staff ? (
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
							{user.first_name + " " + user.last_name}
							<br />
							<small>{user.username}</small> {staff_msg}{" "}
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
