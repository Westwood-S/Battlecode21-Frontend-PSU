import React, { Component } from 'react';
import Api from '../api';
import RankingTeamList from '../components/rankingTeamList';

class Rankings extends Component {
    state = {
      teams: null
    };

    componentDidMount() {
      const { input } = this.state;
      Api.getAllTeam(this.onDataLoad);
	  Api.calculateElo();
    }

    handleChange = (e) => {
      //const { input } = this.state;
      this.setState({ input: e.target.value });
    }

    onDataLoad = (data) => {
      this.setState(data);
    }

    getTeamPage = (page) => {
      const { state } = this;
      if (page !== state.teamPage && page >= 0 && page <= state.teamLimit) {
        Api.getAllTeam(this.onDataLoad);
      }
    }

    search = (e) => {
      const { input } = this.state;
      e.preventDefault();
      Api.getAllTeam(this.onDataLoad);
    }

    render() {
      const { state } = this;
      return (
        <div className="content">
          <div className="container-fluid row">
			<div className="col-md-12">
              <RankingTeamList
                teams={state.teams}
              />
            </div>
          </div>
        </div>
      );
    }
}

export default Rankings;
