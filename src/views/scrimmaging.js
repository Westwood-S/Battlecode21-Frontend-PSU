import React, { Component } from 'react';
import Api from '../api';
import Floater from 'react-floater';
import PaginationControl from "../components/paginationControl";

class ScrimmageHistory extends Component {

    state = {
        scrimPage: 1,
        scrimLimit: 0,
        scrimmages: [],
    };


    refresh = () => {
        Api.getScrimmageHistory(function(s) {
            this.setState({ scrimmages: s });
        }.bind(this));
    }

    componentDidMount() {
        this.refresh();
    }

    playReplay(e) {
        e.preventDefault();
        var url = e.target.href;
        window.open(url, "replay_window", "scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=750");
    }

    getScrimPage = (page) => {
        if (page !== this.state.scrimPage && page >= 0 && page <= this.state.scrimLimit) {
            this.refresh(page);
        }
    }

	onSubFileRequest = (time, r1, r2, map) => {
        Api.downloadScrimmage(time, r1, r2, map)
    }

    render() {
        return (
            <div className="col-md-12">
                <div className="card">
                    <div className="header">
                        <h4 className="title">Scrimmage History <button onClick={this.props.refresh} style={{marginLeft:"10px"}} type="button" className="btn btn-primary btn-sm">Refresh</button></h4>
						<br/>
                        <div>If you're using <b>Chrome</b> with <b>MacOS</b>, after downloading the replay, you should use terminal to <code>unzip nameofthezip.zip</code>. Simply double clicking to unzip might cause file extesion lost. (This is a problem with mac.) Or you can just use <b>safari</b>.</div>
                    </div>
                    <div className="content table-responsive table-full-width">
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Team</th>
                                    <th>Replay</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.scrimmages.map(s => {
                                    let stat_row = <td>{ s.STATUS }</td>
                                    if (s.STATUS.toLowerCase() === "error") {
                                        stat_row = (
                                        <td>
                                            { s.STATUS } 
                                            <Floater content={
                                                <div>
                                                    <p>Our server has run into an error running this scrimmage. Don't worry, we're working on resolving it!</p>
                                                    <p>Error: {s.error_msg}</p>
                                                </div> } showCloseButton={true}>
                                                 <i className="pe-7s-info pe-fw" />
                                            </Floater>
                                        </td>)
                                    }
                                    return (
                                        <tr key={s.id}>
                                            <td>{ s.DATE }</td>
                                            <td>{ s.TIME }</td>
                                            { stat_row }
                                            <td>{ s.ENEMY }</td>
                                            { s.REPLAY==='ready'?<td> <button className="btn btn-xs" onClick={() => this.onSubFileRequest(s.DATESTORE, s.ROBOTA, s.ROBOTB, s.MAP)}>Download</button> </td> :<td>pending...</td> }
                                        </tr>
                                    )
                                }) }
                            </tbody>
                        </table>
                    </div>
                </div>
                <PaginationControl
                    page={this.state.scrimPage}
                    pageLimit={this.state.scrimLimit}
                    onPageClick={(page) => this.getScrimPage(page)}
                />
            </div>
        )
    }
}

class Scrimmaging extends Component {

    refresh = () => {
        window.location.reload();
    }

    render() {
        return (
            <div className="content">
                <div className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <ScrimmageHistory ref={history => {this.history = history}} refresh={this.refresh} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Scrimmaging;