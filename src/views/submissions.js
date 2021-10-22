import React, { Component } from 'react';
import Api from '../api';

class Submissions extends Component {

    //----INITIALIZATION----
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            lastSubmissions: null,
            tourSubmissions: null,
            numLastSubmissions: 0,
            numLastLoaded: 0,
            numTourSubmissions: 0,
            numTourLoaded: 0,
            user: {},
			isLoading: false,
            isSubmitting: ''
        };

    }

    componentDidMount() {
		Api.getTeamSubmissions(this.gotSubmissions);
    }

    componentWillUnmount() {
        // don't leak memory
        clearInterval(this.interval)
    }

    //----UPLOADING FILES----

    // makes an api call to upload the selected file
    uploadData = () => {
		Api.newSubmission(this.state.selectedFile, this.submitCallback)
    }

	submitCallback=(success) => {
        if (success==='uploaded') {
            this.setState({isSubmitting: ''});
            window.location.reload();
        }
        this.setState({isSubmitting: success});
    }

    // change handler called when file is selected
    onChangeHandler = event => {
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        })
    }


    //---GETTING TEAMS SUBMISSION DATA----
    KEYS_CURRENT = ['compiling'] 
    KEYS_LAST = ['last_1', 'last_2', 'last_3']
    KEYS_TOUR = ['tour_final', 'tour_qual', 'tour_seed', 'tour_sprint', 'tour_hs', 'tour_intl_qual', 'tour_newbie']

	// called when status of teams compilation request is received 
    // 0 = in progress, 1 = succeeded, 2 = failed, 3 = server failed
    gotStatus = (data) => {
        this.setState(data)
    }

    // called when submission data is initially received
    // this will be maps of the label of type of submission to submission id
    // this function then makes calles to get the specific data for each submission
    gotSubmissions = (data) => {
        this.setState({lastSubmissions: data});
    }

    // sets submission data for the given key, if all submissions have been found force updates state
    setSubmissionData = (key, data) => {

        let index, add_data
        if (this.KEYS_LAST.includes(key)) {
            switch (key) {
                case 'last_1':
                    index = 0
                    break
                case 'last_2':
                    index = 1
                    break
                case 'last_3':
                    index = 2
                    break
            }

            const arr = this.state["lastSubmissions"]
            let newArr = arr.slice(0, index)
            newArr.push(data)
            this.setState({lastSubmissions: newArr.concat(arr.slice(index + 1))})
        } else {
            switch (key) {
                case 'tour_sprint':
                    add_data = ['Sprint 1', data]
                    break
                case 'tour_seed':
                    add_data = ['Sprint 2', data]
                    break
                case 'tour_qual':
                    add_data = ['Qualifying', data]
                    break
                case 'tour_final':
                    add_data = ['Final', data]
                    break
                case 'tour_hs':
                    add_data = ['US High School', data]
                    break
                case 'tour_intl_qual':
                    add_data = ['International Qualifying', data]
                    break
                case 'tour_newbie':
                    add_data = ['Newbie', data]
                    break
            }

            const arr = this.state["tourSubmissions"]
            let end = arr.slice(1)
            end.push(add_data)
            this.setState({tourSubmissions: end})

        }

    }

    // Downloads the file for given submission id
    onSubFileRequest = (submissionName, numDate) => {
        Api.downloadSubmission(submissionName, numDate, this.renderLoading)
    }

    //----PERMISSIONS----
    // enable iff game active or user is staff
    isSubmissionEnabled() {
        if (this.state.user.is_staff === true) {
            return true;
        }
        return true;
    }

    //----RENDERING----

	renderSubmitting(data) {
        if (data !== '') {
            return(
                <span style={{color: '#FF4A55', marginRight: '10px', textTransform: 'none', fontSize: '14px'}}> { data } </span>
            )
        }
    }
    renderLoading(data) {
        if (data) {
            return(
                <td style={{color: '#FF4A55', marginRight: '10px', textTransform: 'none', fontSize: '14px'}}> loading... </td>
            )
        }
    }

    // return div for submitting files, should be able to disable this when submissions are not being accepts
    renderHelperSubmissionForm() {
        if (this.isSubmissionEnabled()) {
			let status_str = ""
            switch (this.state.status) {
                case 0:
                    status_str = "Currently compiling..."
                    break
                case 1:
                    status_str = "Successfully compiled!"
                    break
                case 2:
                    status_str = "Compilation failed."
                    break
                case 3:
                    status_str = "Internal server error. Try re-submitting your code."
                    break
                default:
                    status_str = ""
                    break
            }
            let btn_class = "btn btn" 
            let file_label = "No file chosen."
			let button = <button disabled style={{float: "right"}} onClick={this.uploadData} className={ btn_class }> Submit </button>
			if (this.state.selectedFile !== null) {
                btn_class += " btn-info btn-fill" 
                file_label = this.state.selectedFile["name"]?this.state.selectedFile["name"]:''
                button = 
                <div style={{float: "right"}}>
                    {this.renderSubmitting(this.state.isSubmitting)}
                <button onClick={this.uploadData} className={ btn_class }> Submit </button></div>
            }

            return (
                <div className="card">
                    <div className="header">
                        <h4 className="title">Submit Code</h4>
                    </div>
                    <div className="content">
                        <p>
                            Create a <code>zip</code> file of your robot player, and submit it below. 
							The submission format should be a zip file that has the <b>same name</b> of your package (e.g.: <code>examplefuncsplayer.zip</code>), containing your package folder (e.g.: <code>examplefuncsplayer</code>), that should contain a <code>RobotPlayer.java</code> and any other code you have written. Your team should give the package a <b>unique name</b>. If the package name is taken by other team, you'll see an error message beside the submit button. 
							<br/> (After changing the package name from <code>examplefuncsplayer</code> to something else, remember to update the <b>first line</b> of every <code>.java</code> file, from <code>package examplefuncsplayer;</code> to <code>package [youruniquepackagename];</code>)
                            </p>
							<pre><code>
							examplefuncsplayer.zip --&gt; examplefuncsplayer ---&gt; RobotPlayer.java, xxx.java
                            </code></pre>
                        
						<p>If you're having trouble submitting:</p>
						<ul>
							<li>
							Try to compile it locally before submitting. You can run this gradle task <code>./gradlew run -PteamA=[yourrobot] -PteamB=[yourrobot]</code> in the terminal to check the log and see if your code throws any exceptions.
							</li>
							<li>
                                Check that your zip contains exactly one directory, and your code is inside that directory.
                            </li>
                            <li>
                                Non-ASCII characters: Ensure your code is completely ASCII. In the past we have had compile errors due to comments containing diacritic characters (áéíóú).
                            </li>
                            <li>
                                Make sure you only import from your own bot, and from java. packages. In particular, do not use javax, javafx, and watch out for importing from other versions of your bot (which may work locally, but will not work on our servers as you can only submit one folder).
                            </li>
							<li>If it's <b>queuing</b>, refresh the page every 3 minutes. If it's <b>queuing</b> forever, the server probably has an outage. Contact Li.</li>
							<li>If it says <b>compile failed</b>, most of time your code genuinely can't compile. As of Sprint Two the submission threshold will increase further.</li>
							<li>
								Send the zip to <a href = "mailto:cecishi@pdx.edu">cecishi@pdx.edu</a> before deadline. (Please grant me a 10-minute's grace.)
							</li>
						</ul>
						
                        <label htmlFor="file_upload">
                            <div className="btn"> Choose File </div> <span style={ { textTransform: 'none', marginLeft: '10px', fontSize: '14px'} }> {file_label} </span>
                        </label>
                        <input id="file_upload" type="file" accept=".zip" onChange={this.onChangeHandler} style={{display: "none"}}/>
                       
                        {button}
                        <p className="text-center category"> {status_str}</p>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="card">
                    <div className="header">
                        <h4 className="title">Submit Code</h4>
                    </div>
                    <div className="content">
                        <p>Submissions are currently disabled! Check back later.</p>
                    </div>
                </div>
            )
        }
    }

    //reder helper for table containing the team's latest successfully compiled submissions
    renderHelperLastTable() {
        if (this.state.lastSubmissions === null) {
            return (
                <p className="text-center category">
                Submit more. Fail fast.<br/><br/>
                </p>
            )
        } else if (this.state.lastSubmissions.length === 0) {
			if (this.state.status === 0) {
                return (
                    <p>
                    Your code is currently compiling—you'll see it here if it finishes successfully.
                    </p>
                )  
            } else { 
                return (
                    <p>
                    You haven't submitted any code yet!
                    </p>
                )  
            }
        } else {
            const submissionRows = this.state.lastSubmissions.map((submission, index) => {
                if (Object.keys(submission).length === 0) {
                    return (
                        <tr><td> <div className="btn btn-xs" style={{visibility: "hidden"}}>Loading...</div></td><td></td></tr>
                    )
                } else { 
                    return (
                        <tr key={ submission.id }>
                            <td>{ (new Date(submission.readableDate)).toLocaleString() }</td>
							{submission.status==='compiled'?
                            <td> <button className="btn btn-xs" onClick={() => this.onSubFileRequest(submission.name, submission.numDate)}>Download</button> </td>   :
							<td>{submission.status}</td>}
                            {this.renderLoading(this.state.isLoading)}                       
                        </tr>
                    ) 
                }
            })

            return (
                <table className="table table-hover table-striped">
                    <thead>
                    <tr>
                        <th>Submission at</th>
                    </tr>
                    </thead>
                    <tbody>
                    { submissionRows }
                    </tbody>
                </table>
            )
        }
        
    }

    //reder helper for table containing the team's tournament submissions
    renderHelperTourTable() {
        if (this.state.tourSubmissions === null){
            return (
                <p className="text-center category">
                Loading submissions...<br/><br/>
                </p>
            )
        } else if (this.state.tourSubmissions.length === 0) {
            return (
                <p>
                Code submitted to tournaments will appear here after the tournament.
                </p>
            ) 
        } else {
            let tourRows = this.state.tourSubmissions.map(submission => {
                if (submission.length === 0) {
                    return (
                        <tr><td> <div className="btn btn-xs" style={{visibility: "hidden"}}>Loading...</div></td><td></td><td></td></tr>
                    )
                } else {
                    return(
                        <tr key={ submission[1].id }>
                            <td>{ (submission[0]) }</td>
                            <td>{ (new Date(submission[1].submitted_at)).toLocaleString() }</td>
                            <td> <button className="btn btn-xs" onClick={() => this.onSubFileRequest(submission[1].id, submission[0])}>Download</button> </td>
                        </tr>
                    )
                }   
            })


            return (
                <table className="table table-hover table-striped">
                    <thead>
                    <tr>
                        <th>Tournament</th>
                        <th>Submission Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    { tourRows }
                    </tbody>
                </table>
            )
        }
    }
    
    render() {
        return (
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            { this.renderHelperSubmissionForm() }
                            <div className="card">
                                <div className="header">
                                    <h4 className="title">Latest Submissions</h4>
                                </div>
                                <div className="content">
                                    { this.renderHelperLastTable() }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Submissions;
