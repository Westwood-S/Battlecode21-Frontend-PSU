import React, { Component } from "react";
import Api from "../api";
import UserCard from "../components/userCard";
import Floater from "react-floater";
import { Children } from "react";

const TextInputField = ({ label, type, id, ...otherInputAttributes }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input type={type} className="form-control" id={id} {...otherInputAttributes} />
    </div>
  );
};

TextInputField.defaultProps = {
  type: "text",
};

const TextAreaField = ({ label, id, placeholder, ...otherTextareaAttributes }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <textarea rows={5} className="form-control" placeholder={placeholder} id={id} {...otherTextareaAttributes} />
    </div>
  );
};

const OptionSelectionField = ({ label, id, options, ...otherSelectAttributes }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <select className="form-control" id={id} {...otherSelectAttributes}>
        <option value=""></option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

const EvenlyDividedRow = ({ children }) => {
  const sizeOfColumn = Children.count(children);
  const classOfCol = `col-md-${12 / sizeOfColumn}`;
  return (
    <div className="row">
      {Children.toArray(children).map((child, index) => (
        <div key={index} className={classOfCol}>
          {child}
        </div>
      ))}
    </div>
  );
};

const ResumeUploadSection = ({ hasUploaded, hasSelectedFile, fileLabel, onUploadButtonClicked, onFileChange }) => {
  return (
    <div className="form-group">
      <label>Resume</label>
      <ResumeUploadFloator />
      <ResumeUploadedIndicator hasUploaded={hasUploaded} />
      <br />
      <ResumeUploader
        hasSelectedFile={hasSelectedFile}
        fileLabel={fileLabel}
        onUploadButtonClicked={onUploadButtonClicked}
        onFileChange={onFileChange}
      />
    </div>
  );
};

const ResumeUploadFloator = () => {
  const explaination = (
    <div>
      <p>
        We'll share your resume with our <a href="http://battlecode.org/#sponsors-sponsors">sponsors</a>. In the past,
        sponsors have offered our competitors opprotunities based of their resumes and performance in Battlecode!
      </p>
    </div>
  );

  return (
    <Floater content={explaination} showCloseButton={true}>
      <i className="pe-7s-info pe-fw" />
    </Floater>
  );
};

const ResumeUploadedIndicator = ({ hasUploaded }) => {
  if (hasUploaded) {
    return (
      <label style={{ float: "right", color: "green" }}>
        <i className="pe-7s-check pe-fw" style={{ fontWeight: "bold" }} />
        Uploaded!
      </label>
    );
  }
  return <label style={{ float: "right" }}> You have not uploaded a resume.</label>;
};

const ResumeUploader = ({ hasSelectedFile, fileLabel, onUploadButtonClicked, onFileChange }) => {
  let btnClass = "btn btn";
  if (hasSelectedFile) {
    btnClass += " btn-info btn-fill";
  }

  return (
    <>
      <label htmlFor="file_upload">
        <div className="btn"> Choose File </div>{" "}
        <span style={{ textTransform: "none", marginLeft: "10px", fontSize: "14px" }}> {fileLabel} </span>
      </label>
      <input id="file_upload" type="file" accept=".pdf" onChange={onFileChange} style={{ display: "none" }} />
      <button disabled style={{ float: "right" }} onClick={onUploadButtonClicked} className={btnClass}>
        {" "}
        Upload{" "}
      </button>
    </>
  );
};

const AccountLayout = ({ editForm, userCard }) => {
  return (
    <div className="content">
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8">{editForm}</div>
            <div className="col-md-4">{userCard}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

class Account extends Component {
  constructor() {
    super();

    this.state = {
      user: {
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        date_of_birth: "",
        bio: "",
        avatar: "",
        country: "",
        is_staff: "",
        id: "",
        verified: "",
      },
      up: "Update Info",
      selectedFile: null,
    };
    this.handleUploadedFileOnChange = this.handleUploadedFileOnChange.bind(this);
    this.handleTextFieldOnChange = this.handleTextFieldOnChange.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.uploadProfile = this.uploadProfile.bind(this);
    this.uploadResume = this.uploadResume.bind(this);
  }

  handleTextFieldOnChange(e) {
    var id = e.target.id;
    var val = e.target.value;
    console.log(id, val);
    this.setState(function (prevState) {
      prevState.user[id] = val;
      return prevState;
    });
  }

  handleUploadedFileOnChange(event) {
    console.log(event.target.files[0]);
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    });
  }

  updateUser() {
    this.setState({ up: '<i class="fa fa-circle-o-notch fa-spin"></i>' });
    Api.updateUser(
      this.state.user,
      function (response) {
        if (response) this.setState({ up: '<i class="fa fa-check"></i>' });
        else this.setState({ up: '<i class="fa fa-times"></i>' });
        setTimeout(
          function () {
            this.setState({ up: "Update Info" });
          }.bind(this),
          2000
        );
      }.bind(this)
    );
  }

  uploadProfile(e) {
    var reader = new FileReader();
    reader.onloadend = () =>
      this.setState(function (prevState) {
        prevState.user.avatar = reader.result;
        return prevState;
      });
    reader.readAsDataURL(e.target.files[0]);
  }

  uploadResume() {
    Api.resumeUpload(this.state.selectedFile, null);
  }

  render() {
    let file_label = "No file chosen.";
    if (this.state.selectedFile !== null) {
      file_label = this.state.selectedFile["name"];
    }

    const editForm = (
      <div className="card">
        <div className="header">
          <h4 className="title">Edit Profile</h4>
        </div>
        <div className="content">
          <h5>Make sure to press the "Update Info" button, and wait for confirmation!</h5>
          <EvenlyDividedRow>
            <TextInputField
              label="Username"
              id="username"
              onChange={this.handleTextFieldOnChange}
              value={this.state.user.username}
              readOnly
            />
            <TextInputField
              label="Email"
              id="email"
              type="email"
              onChange={this.handleTextFieldOnChange}
              value={this.state.user.email}
            />
          </EvenlyDividedRow>
          <EvenlyDividedRow>
            <TextInputField
              label="First Name"
              id="first_name"
              onChange={this.handleTextFieldOnChange}
              value={this.state.user.first_name}
            />
            <TextInputField
              label="Last Name"
              id="last_name"
              onChange={this.handleTextFieldOnChange}
              value={this.state.user.last_name}
            />
          </EvenlyDividedRow>
          <EvenlyDividedRow>
            <TextInputField
              label="Date of Birth (YYYY-MM-DD)"
              id="date_of_birth"
              onChange={this.handleTextFieldOnChange}
              value={this.state.user.date_of_birth}
            />
            <OptionSelectionField
              label="Country"
              id="country"
              options={contries}
              value={this.state.user.country}
              onChange={this.handleTextFieldOnChange}
            />
          </EvenlyDividedRow>
          <EvenlyDividedRow>
            <TextInputField
              label="User Avatar URL"
              id="avatar"
              onChange={this.handleTextFieldOnChange}
              value={this.state.user.avatar}
            />
          </EvenlyDividedRow>
          <EvenlyDividedRow>
            <TextAreaField
              label="User Bio"
              placeholder="Put your bio here."
              id="bio"
              onChange={this.handleTextFieldOnChange}
              value={this.state.user.bio}
            />
          </EvenlyDividedRow>
          <EvenlyDividedRow>
            <ResumeUploadSection
              hasSelectedFile={this.state.selectedFile}
              fileLabel={file_label}
              onUploadButtonClicked={this.uploadResume}
              onFileChange={this.handleUploadedFileOnChange}
            />
          </EvenlyDividedRow>
          <button
            type="button"
            onClick={this.updateUser}
            className="btn btn-info btn-fill pull-right"
            dangerouslySetInnerHTML={{ __html: this.state.up }}
          ></button>
          <div className="clearfix" />
        </div>
      </div>
    );
    const userCard = <UserCard user={this.state.user} />;

    return <AccountLayout editForm={editForm} userCard={userCard} />;
  }
}

const contries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antigua & Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bosnia & Herzegovina",
  "Botswana",
  "Brazil",
  "British Virgin Islands",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Cape Verde",
  "Cayman Islands",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Congo",
  "Cook Islands",
  "Costa Rica",
  "Cote D Ivoire",
  "Croatia",
  "Cruise Ship",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Estonia",
  "Ethiopia",
  "Falkland Islands",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Polynesia",
  "French West Indies",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kuwait",
  "Kyrgyz Republic",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macau",
  "Macedonia",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Nepal",
  "Netherlands",
  "Netherlands Antilles",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Norway",
  "Oman",
  "Pakistan",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Reunion",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Pierre & Miquelon",
  "Samoa",
  "San Marino",
  "Satellite",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "St Kitts & Nevis",
  "St Lucia",
  "St Vincent",
  "St. Lucia",
  "Sudan",
  "Suriname",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor L'Este",
  "Togo",
  "Tonga",
  "Trinidad & Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks & Caicos",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "Uruguay",
  "Uzbekistan",
  "Venezuela",
  "Vietnam",
  "Virgin Islands (US)",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

export default Account;
