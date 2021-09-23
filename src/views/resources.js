import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Resources extends Component {
    render() {
        return (
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="header">
                                    <h4 className="title">Game Specifications</h4>
                                </div>
                                <div className="content">
                                <p className='text-center'>
                                    <a target="_blank" rel="noopener noreferrer" type="button" className="btn btn-info btn-fill text-center" href='https://2021.battlecode.org/specs/specs.md.html'>Game Specifications</a>
                                </p>
                                <p className='text-center'>
                                    <a target="_blank" rel="noopener noreferrer" type="button" className="btn btn-info btn-fill text-center" href='https://2021.battlecode.org/javadoc/index.html'>Javadoc reference</a>
                                </p>
                                </div>
                            </div>
                            <div className="card">
                                <div className="header">
                                    <h4 className="title">Lectures</h4>
                                </div>
                                <div className="content">
                                <p>
                                    Battlecode 2021 will be holding lectures, where a dev will be going over possible strategy, coding up an example player, answering questions, etc.
                                    Lectures are streamed on Twitch every weekday the first two weeks of IAP 7-10 PM Eastern Time.
                                </p>
                                <p>
                                    All lectures are streamed live on <a style={{fontWeight:700}} target="_blank" rel="noopener noreferrer" href='https://twitch.tv/mitbattlecode'>our Twitch account</a>, and
                                    are later uploaded to <a style={{fontWeight:700}} target="_blank" rel="noopener noreferrer" href='https://youtube.com/channel/UCOrfTSnyimIXfYzI8j_-CTQ'>our YouTube channel</a>.
                                </p>

                                </div>
                            </div>
							<div className="card">
                                <div className="header">
                                    <h4 className="title">Other Resources</h4>
                                </div>
                                <div className="content">
                                    <p>
                                <ul>
                                    <li><a style={{fontWeight:700}} target="_blank" rel="noopener noreferrer" href='https://2021.battlecode.org/javadoc/index.html'>Javadocs</a>: the documentation of <code>RobotController</code> methods. Very helpful.</li>
                                    <li><NavLink to='common-issues' style={{fontWeight:700}}>Common Issues</NavLink>: a non-exhaustive collection of common problems, and fixes.</li>
                                    <li><NavLink to='debugging'  style={{fontWeight:700}}>Debugging</NavLink>: a guide for how to debug your code.</li>
                                </ul>
                                </p>
                                <p>
                                    All of the code powering Battlecode 2021 is open source on GitHub, in the <a style={{fontWeight:700}} target="_blank" rel="noopener noreferrer" href='https://github.com/battlecode/battlecode21'>battlecode21 repository</a>.
                                </p>
                                </div>
                            </div>

					    </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Resources;
