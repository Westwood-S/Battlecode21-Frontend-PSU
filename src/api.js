import $ from "jquery";
import * as Cookies from "js-cookie";
//firebaseAuth is needed
import firebaseAuth from "./firebaseConfig";
import { sha256 } from "js-sha256";
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
	onAuthStateChanged,
	signOut,
} from "firebase/auth";
import { getFirestore, doc, collection, getDoc, getDocs, updateDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import AWS from "aws-sdk";

const URL = process.env.REACT_APP_BACKEND_URL;
const LEAGUE = 0;
const PAGE_LIMIT = 10;
//firebase
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();
//aws
const region = "us-west-2";
const accessKeyId = process.env.AWSAccessKeyId;
const secretAccessKey = process.env.AWSSecretKey;
AWS.config.region = region;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: "us-west-2:2fc75d6e-33aa-46f7-9fd7-d8213b01b56f",
});
const s3 = new AWS.S3({
	region,
	accessKeyId,
	secretAccessKey,
	signatureVersion: "v4",
});

class Api {
	//----SUBMISSIONS----

	static async newSubmission(submissionFile, callback) {
		var teamName = Cookies.get("teamName");
		var teamKey = Cookies.get("teamKey");
		var continueToUpload = true;
		var uploadFailed = false;
		var dateNumVersion = Date.now();

		if (teamName && teamKey) {
			const robotRef = doc(db, "submissions", "robots");
			const robotSnap = await getDoc(robotRef);
			//check if robot name is taken
			if (robotSnap.exists() && robotSnap.data().submissions) {
				var allSubmission = robotSnap.data().submissions;
				allSubmission.find((o, i) => {
					if (o.robot === submissionFile.name.slice(0, submissionFile.name.length - 4) && o.teamname !== teamName) {
						callback("Robot name taken.");
						continueToUpload = false;
						return;
					}
				});
			}

			//if robot name is not taken then continue to upload
			if (continueToUpload) {
				callback("Uploading...");

				const s3PutParams = {
					Bucket: "se-battlecode",
					Key: teamKey + "date" + dateNumVersion + "-" + submissionFile.name,
					Expires: 60,
				};
				const uploadURL = await s3.getSignedUrlPromise("putObject", s3PutParams);
				await fetch(uploadURL, {
					method: "PUT",
					headers: {
						"Content-Type": "multipart/form-data",
					},
					body: submissionFile,
				});

				const s3GetParams = {
					Bucket: "se-battlecode",
					Key: teamKey + "date" + dateNumVersion + "-" + submissionFile.name,
				};
				s3.getObject(s3GetParams, function (err, data) {
					if (err) {
						callback("Upload failed. Plz try again later.");
						uploadFailed = true;
						return;
					}
					console.log(data);
				});

				if (!uploadFailed) {
					callback("Successfully Uploaded!");

					const teamRef = doc(db, "teams", teamKey);
					const teamSnap = await getDoc(teamRef);
					if (teamSnap.exists()) {
						var dateReadable = Date(Date.now()).toString();
						const storageRef = ref(storage, teamName + "/" + dateNumVersion + submissionFile.name);
						uploadBytes(storageRef, submissionFile).then((snapshot) => {
							console.log("Uploaded a blob or file!");
							//store info to teams collection up to three submissions
							if (teamSnap.data().submissions) {
								var allSubmissions = teamSnap.data().submissions;
								if (allSubmissions.length >= 3) {
									allSubmissions.splice(2, allSubmissions.length - 2);
								}
								allSubmissions.unshift({
									name: submissionFile.name,
									numDate: dateNumVersion,
									readableDate: dateReadable,
									status: "queuing",
								});
								updateDoc(teamRef, {
									submissions: allSubmissions,
								}).then(function () {
									callback("Uploaded another submission.");
								});
							} else {
								var firstSubmission = [
									{
										name: submissionFile.name,
										numDate: dateNumVersion,
										readableDate: dateReadable,
										status: "queuing",
									},
								];
								updateDoc(teamRef, {
									submissions: firstSubmission,
								}).then(function () {
									callback("Uploaded the first submission.");
								});
							}
						});
					}
				}
			}
		}
	}

	static downloadSubmission(submissionName, numDate, callback) {
		if (Cookies.get("teamName")) {
			getDownloadURL(ref(storage, Cookies.get("teamName") + "/" + numDate + submissionName))
				.then((url) => {
					console.log(url);
					callback(true);
					const aHelper = document.createElement("a");
					aHelper.style.display = "none";
					aHelper.href = url;
					aHelper.download = `${submissionName}.zip`;
					document.body.appendChild(aHelper);
					aHelper.click();
					window.URL.revokeObjectURL(url);
					callback(false);
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			callback(false);
		}
	}

	static async getTeamSubmissions(callback) {
		if (Cookies.get("teamKey")) {
			const teamRef = doc(db, "teams", Cookies.get("teamKey"));
			const teamSnap = await getDoc(teamRef);
			if (teamSnap.exists() && teamSnap.data().submissions) {
				callback(teamSnap.data().submissions);
			} else {
				callback(null);
			}
		} else {
			callback(null);
		}
	}

	//----TEAM INFO---

	static getTeamById(team_id, callback) {
		if ($.ajaxSettings && $.ajaxSettings.headers) {
			delete $.ajaxSettings.headers.Authorization;
		} // we should not require valid login for this.

		$.get(`${URL}/api/${LEAGUE}/team/${team_id}/`).done((data, status) => {
			callback(data);
		});

		$.ajaxSetup({
			headers: { Authorization: `Bearer ${Cookies.get("token")}` },
		});
	}

	static getTeamWinStats(callback) {
		if (!Cookies.get("teamKey")) {
			callback([0, 0]);
		} else {
			return Api.getOtherTeamWinStats(Cookies.get("teamKey"), callback);
		}
	}

	static async getOtherTeamWinStats(team, callback) {
		const teamRef = doc(db, "teams", team);
		const teamSnap = await getDoc(teamRef);
		if (teamSnap.exists()) {
			callback([teamSnap.data().won, teamSnap.data().los]);
		} else {
			callback([0, 0]);
		}
	}

	//calculates rank of given team, with tied teams receiving the same rank
	//i.e. if mu is 10,10,1 the ranks would be 1,1,3
	static getTeamRanking(team_id, callback) {
		if ($.ajaxSettings && $.ajaxSettings.headers) {
			delete $.ajaxSettings.headers.Authorization;
		} // we should not require valid login for this.

		const requestUrl = `${URL}/api/${LEAGUE}/team/${team_id}/ranking/`;
		$.get(requestUrl).done((data, status) => {
			callback(data);
		});

		$.ajaxSetup({
			headers: { Authorization: `Bearer ${Cookies.get("token")}` },
		});
	}

	static async updateTeam(params, callback) {
		console.log(params);
		const teamRef = doc(db, "teams", params.id);
		await updateDoc(teamRef, {
			bio: params.bio,
		});

		const teamSnap = await getDoc(teamRef);
		console.log(teamSnap);
		if (teamSnap.exists() && teamSnap.data().bio === params.bio) {
			callback(true);
		} else {
			callback(false);
		}
	}

	//----GENERAL INFO----

	static async calculateElo() {
		var allTeam = [];
		var allScrimmages = [];
		var scrimmagesData = [];

		const resultRef = doc(db, "submissions", "gameResults");
		const docSnap = await getDoc(resultRef);
		if (docSnap.exists() && docSnap.data().scrimmages) {
			var scrimmagesDataFull = docSnap.data().scrimmages;
			//scrimmagesData is for loop gameResults to calculate elo
			//allScrimmages will be updated with the new elo result
			if (scrimmagesDataFull.length >= 501) {
				allScrimmages = scrimmagesDataFull.slice(0, 501);
				scrimmagesData = scrimmagesDataFull.slice(0, 101);
			} else {
				allScrimmages = scrimmagesDataFull;
				scrimmagesData = scrimmagesDataFull;
			}

			const querySnapshot = await getDocs(collection(db, "teams"));
			querySnapshot.forEach((doc) => {
				allTeam.push(doc.data());
			});
			scrimmagesData.find((o, i) => {
				if (o.Elo === false) {
					//Elo equals to false means havent calculated yet
					var won = o.STATUS === "Awon" ? o.TEAMA : o.STATUS === "Bwon" ? o.TEAMB : "";
					var los = o.STATUS === "Awon" ? o.TEAMB : o.STATUS === "Bwon" ? o.TEAMA : "";
					var wonIndex;
					var losIndex;
					allTeam.find((o, index) => {
						if (o.name === won) {
							wonIndex = index;
							// stop searching
							return true;
						}
					});
					allTeam.find((o, index) => {
						if (o.name === los) {
							losIndex = index;
							// stop searching
							return true;
						}
					});

					if (wonIndex !== null && losIndex !== null && allTeam[losIndex] && allTeam[wonIndex]) {
						var probW =
							(1.0 * 1.0) / (1 + 1.0 * Math.pow(10, (1.0 * (allTeam[losIndex].score - allTeam[wonIndex].score)) / 400));
						var probL = 1 - probW;
						allTeam[wonIndex].score += 32 * (1 - probW);
						allTeam[losIndex].score += 32 * (0 - probL);
						allTeam[wonIndex].won += 1;
						allTeam[losIndex].los += 1;

						allScrimmages.splice(i, 1, {
							DATE: scrimmagesData[i].DATE,
							DATESTORE: scrimmagesData[i].DATESTORE,
							Elo: true,
							MAP: scrimmagesData[i].MAP,
							REPLAY: scrimmagesData[i].REPLAY,
							ROBOTA: scrimmagesData[i].ROBOTA,
							ROBOTB: scrimmagesData[i].ROBOTB,
							STATUS: scrimmagesData[i].STATUS,
							TEAMA: scrimmagesData[i].TEAMA,
							TEAMB: scrimmagesData[i].TEAMB,
							TIME: scrimmagesData[i].TIME,
						});
					}
				}
			});

			await updateDoc(resultRef, {
				scrimmages: allScrimmages,
			});

			for (var i = 0; i < allTeam.length; i++) {
				const eachTeamRef = doc(db, "teams", sha256(allTeam[i].name));
				await updateDoc(eachTeamRef, {
					won: allTeam[i].won,
					score: Math.ceil(allTeam[i].score),
					los: allTeam[i].los,
				});
			}
		} else {
			console.log("Fail to get submission data.");
		}
	}

	static getUpdates(callback) {
		if ($.ajaxSettings && $.ajaxSettings.headers) {
			delete $.ajaxSettings.headers.Authorization;
		} // we should not require valid login for this.

		$.get(`${URL}/api/league/${LEAGUE}/`, (data, success) => {
			for (let i = 0; i < data.updates.length; i++) {
				const d = new Date(data.updates[i].time);
				data.updates[i].dateObj = d;
				data.updates[i].date = d.toLocaleDateString();
				data.updates[i].time = d.toLocaleTimeString();
			}

			callback(data.updates);
		});

		$.ajaxSetup({
			headers: { Authorization: `Bearer ${Cookies.get("token")}` },
		});
	}

	//----SEARCHING----

	static search(query, callback) {
		const encodedQuery = encodeURIComponent(query);
		const teamUrl = `${URL}/api/${LEAGUE}/team/?search=${encodedQuery}&page=1`;
		const userUrl = `${URL}/api/user/profile/?search=${encodedQuery}&page=1`;

		$.get(teamUrl, (teamData) => {
			$.get(userUrl, (userData) => {
				const teamLimit = parseInt(teamData.count / PAGE_LIMIT, 10) + !!(teamData.count % PAGE_LIMIT);
				const userLimit = parseInt(userData.count / PAGE_LIMIT, 10) + !!(userData.count % PAGE_LIMIT);
				callback({
					users: userData.results,
					userLimit,
					userPage: 1,
					teams: teamData.results,
					teamLimit,
					teamPage: 1,
				});
			});
		});
	}

	static async getAllTeam(callback) {
		var teams = [];

		const teamSnapshot = await getDocs(collection(db, "teams"));
		teamSnapshot.forEach((doc) => {
			teams.push(doc.data());
		});

		teams.sort(function (a, b) {
			return b.score - a.score;
		});
		callback({ teams });
	}

	static searchTeam(query, page, callback) {
		const encQuery = encodeURIComponent(query);
		const teamUrl = `${URL}/api/${LEAGUE}/team/?search=${encQuery}&page=${page}`;

		$.get(teamUrl, (teamData) => {
			const teamLimit = parseInt(teamData.count / PAGE_LIMIT, 10) + !!(teamData.count % PAGE_LIMIT);
			callback({
				query,
				teams: teamData.results,
				teamLimit,
				teamPage: page,
			});
		});
	}

	static searchUser(query, page, callback) {
		const encQuery = encodeURIComponent(query);
		const userUrl = `${URL}/api/user/profile/?search=${encQuery}&page=${page}`;

		$.get(userUrl, (userData) => {
			callback({
				userPage: page,
				users: userData.results,
			});
		});
	}

	//----USER FUNCTIONS----

	static async createTeam(teamName, callback) {
		if (!teamName) {
			callback(false);
		}

		var teamCode = sha256(teamName);
		var userEmail = Cookies.get("userEmail");
		if (!userEmail) {
			var user = auth.currentUser;
			user.providerData.forEach(function (profile) {
				userEmail = profile.email;
				Cookies.set("userEmail", userEmail);
			});
		}

		const teamRef = doc(db, "teams", teamCode);
		const teamSnap = await getDoc(teamRef);
		if (teamSnap.exists()) {
			callback(false);
		} else {
			if (userEmail) {
				const usersRef = collection(db, "users");
				await setDoc(doc(usersRef, userEmail), {
					teamname: teamName,
					team_key: teamCode,
				});

				const teamsRef = collection(db, "teams");
				await setDoc(doc(teamsRef, teamCode), {
					name: teamName,
					users: [userEmail],
					team_key: teamCode,
					id: teamCode,
					bio: "",
					score: 1200,
					won: 0,
					los: 0,
				});

				const teamRef = doc(db, "teams", teamCode);
				const teamSnap = await getDoc(teamRef);
				if (teamSnap.exists()) {
					Cookies.set("teamKey", teamCode);
					Cookies.set("teamName", teamName);
					callback(true);
				} else {
					callback(false);
				}
			} else {
				callback(false);
			}
		}
	}

	static async joinTeam(secret_key, team_name, callback) {
		if (secret_key !== sha256(team_name)) {
			callback(false);
		}

		var userEmail = Cookies.get("userEmail");
		if (!userEmail) {
			var user = auth.currentUser;
			user.providerData.forEach(function (profile) {
				userEmail = profile.email;
				Cookies.set("userEmail", userEmail);
			});
		}

		if (userEmail) {
			const teamRef = doc(db, "teams", secret_key);
			const teamSnap = await getDoc(teamRef);
			if (teamSnap.exists()) {
				console.log("got here");
				if (team_name === teamSnap.data().name) {
					var teamUsers = teamSnap.data().users;
					const index = teamUsers.indexOf(userEmail);
					if (index === -1) {
						teamUsers.push(userEmail);
						await updateDoc(teamRef, {
							users: teamUsers,
						});
					}

					const userRef = doc(db, "users", userEmail);
					await updateDoc(userRef, {
						teamname: team_name,
						team_key: secret_key,
					});

					Cookies.set("teamKey", secret_key);
					Cookies.set("teamName", team_name);
					callback(true);
				} else {
					callback(false);
				}
			} else {
				// doc.data() will be undefined in this case
				console.log("No team document.");
				callback(false);
			}
		} else {
			callback(false);
		}
	}

	static async leaveTeam(callback) {
		var userEmail = Cookies.get("userEmail");
		if (!userEmail) {
			var user = auth.currentUser;
			user.providerData.forEach(function (profile) {
				userEmail = profile.email;
				Cookies.set("userEmail", userEmail);
			});
		}

		if (userEmail) {
			var userRef = doc(db, "users", userEmail);
			await updateDoc(userRef, {
				teamname: "",
				team_key: "",
			});

			var teamKey = Cookies.get("teamKey");
			Cookies.remove("teamKey");
			Cookies.remove("teamName");

			const teamRef = doc(db, "teams", teamKey);
			const teamSnap = await getDoc(teamRef);
			if (teamSnap.exists()) {
				var teamUsers = teamSnap.data().users;
				const index = teamUsers.indexOf(userEmail);
				if (index > -1) {
					teamUsers.splice(index, 1);
				}

				await updateDoc(teamRef, {
					users: teamUsers,
				});

				callback(true);
			} else {
				console.log("No such document!");
				callback(false);
			}
		} else {
			callback(false);
		}
	}

	static async getUserTeam(callback) {
		var userEmail = Cookies.get("userEmail");
		var teamKeyFromCookie = Cookies.get("teamKey");
		if (!teamKeyFromCookie) {
			if (!userEmail) {
				var user = auth.currentUser;
				if (user) {
					console.log(user);
					user.providerData.forEach(function (profile) {
						userEmail = profile.email;
						Cookies.set("userEmail", userEmail);
					});
				}
			}

			if (userEmail) {
				const userRef = doc(db, "users", userEmail);
				const userSnap = await getDoc(userRef);
				//try to get team from cookie to save db access
				if (userSnap.exists()) {
					if (userSnap.data().team_key) {
						const userTeamRef = doc(db, "teams", userSnap.data().team_key);
						const userTeamSnap = await getDoc(userTeamRef);
						if (userTeamSnap.exists()) {
							Cookies.set("teamKey", userTeamSnap.data().team_key);
							Cookies.set("teamName", userTeamSnap.data().name);
							callback(userTeamSnap.data());
						} else {
							// doc.data() will be undefined in this case
							console.log("Not in team sorry");
							callback(null);
						}
					} else {
						callback(null);
					}
				} else {
					console.log("Not even have this user, sorry");
					await setDoc(userRef, {
						teamname: "",
						team_key: "",
					});
					callback(null);
				}
			} else {
				callback(null);
			}
		} else {
			//TODO: remember to clear all cookies when signed out
			const teamRef = doc(db, "teams", teamKeyFromCookie);
			const teamSnap = await getDoc(teamRef);
			if (teamSnap.exists()) {
				callback(teamSnap.data());
			} else {
				console.log("Can't find this team, sorry");
				callback(null);
			}
		}
	}

	static updateUser(profile, callback) {
		$.ajax({
			url: Cookies.get("user_url"),
			data: JSON.stringify(profile),
			type: "PATCH",
			contentType: "application/json",
			dataType: "json",
		})
			.done((data, status) => {
				callback(true);
			})
			.fail((xhr, status, error) => {
				callback(false);
			});
	}

	static resumeUpload(resume_file, callback) {
		$.post(`${Cookies.get("user_url")}resume_upload/`, (data, succcess) => {
			$.ajax({
				url: data["upload_url"],
				method: "PUT",
				data: resume_file,
				processData: false,
				contentType: false,
			});
		});
	}

	//----SCRIMMAGING----

	static async getAllTeamScrimmages(callback) {
		const resultRef = doc(db, "submissions", "gameResults");
		const resultSnap = await getDoc(resultRef);
		if (resultSnap.exists()) {
			callback(resultSnap.data().scrimmages);
		} else {
			callback(null);
		}
	}

	static getScrimmageHistory(callback) {
		if (Cookies.get("teamName")) {
			var myTeam = Cookies.get("teamName");
			this.getAllTeamScrimmages((s) => {
				const scrimmageHistory = [];
				for (let i = 0; i < s.length; i++) {
					if (s[i].TEAMA !== myTeam && s[i].TEAMB !== myTeam) continue;
					const on_red = s[i].TEAMA === myTeam;
					if (s[i].STATUS === "Awon") s[i].STATUS = on_red ? "won" : "lost";
					else if (s[i].STATUS === "Bwon") s[i].STATUS = on_red ? "lost" : "won";
					s[i].ENEMY = on_red ? s[i].TEAMB : s[i].TEAMA;
					scrimmageHistory.push(s[i]);
				}
				callback(scrimmageHistory);
			});
		} else {
			callback(null);
		}
	}

	static downloadScrimmage(date, robotOne, robotTwo, map) {
		getDownloadURL(ref(storage, date + robotOne + "-vs-" + robotTwo + "-on-" + map + ".zip"))
			.then((url) => {
				console.log(url);
				const aHelper = document.createElement("a");
				aHelper.style.display = "none";
				aHelper.href = url;
				//aHelper.target = "_blank";
				//some hates a new window pops open when click download
				aHelper.download = `${robotOne}-vs-${robotTwo}-on-${map}.bc20.zip`;
				document.body.appendChild(aHelper);
				aHelper.click();
				window.URL.revokeObjectURL(url);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	//----TOURNAMENTS----

	static getNextTournament(callback) {
		callback({
			est_date_str: "10 AM PT on Nov 18, 2021",
			seconds_until: (Date.parse(new Date("Nov 18, 2021 10:00:00")) - Date.parse(new Date())) / 1000,
			tournament_name: "Sprint Three",
		});
	}

	static getTournaments(callback) {
		if ($.ajaxSettings && $.ajaxSettings.headers) {
			delete $.ajaxSettings.headers.Authorization;
		} // we should not require valid login for this.
		$.get(`${URL}/api/${LEAGUE}/tournament/`).done((data, status) => {
			console.log(data);
			callback(data.results);
		});
	}

	//----AUTHENTICATION----

	static register(email, password, first, last, callback) {
		try {
			createUserWithEmailAndPassword(auth, email, password)
				.then(() => {
					try {
						Api.login(email, password, callback);

						updateProfile(auth.currentUser, {
							displayName: first + " " + last,
						})
							.then(() => {
								console.log("successfully updated display name");
							})
							.catch((error) => {
								console.log("firebase update user display name error: " + error);
							});
					} catch (error) {
						console.log("login followed by register error: " + error);
					}
				})
				.catch((error) => {
					const errorMessage = error.message;
					console.log("create user error: " + errorMessage);
				});
		} catch (error) {
			console.log("register error: " + error);
		}
	}

	static login(email, password, callback) {
		try {
			signInWithEmailAndPassword(auth, email, password)
				.then(() => {
					Cookies.set("userEmail", email);
					callback(null, true);
				})
				.catch((error) => {
					const errorMessage = error.message;
					console.log("sign in error: " + errorMessage);
				});
		} catch (error) {
			callback(error, false);
		}
	}

	static logout() {
		signOut(auth)
			.then(() => {
				Cookies.set("userEmail", "");
				Cookies.set("teamKey", "");
				Cookies.set("teamName", "");
			})
			.catch((error) => {
				alert(error);
			});
	}

	static loginCheck(callback) {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				callback(true);
			} else {
				callback(false);
			}
		});
	}

	static verifyAccount(registrationKey, callback) {
		const userId = encodeURIComponent(Cookies.get("username"));
		$.post(
			`${URL}/api/verify/${userId}/verifyUser/`,
			{
				registration_key: registrationKey,
			},
			(data, success) => {
				callback(data, success);
			}
		);
	}

	static doResetPassword(password, token, callback) {
		if ($.ajaxSettings && $.ajaxSettings.headers) {
			delete $.ajaxSettings.headers.Authorization;
		}
		console.log("calling api/password_reset/confirm");
		var req = {
			password: password,
			token: token,
		};

		$.post(`${URL}/api/password_reset/confirm/`, req, (data, success) => {
			callback(data, success);
		}).fail((xhr, status, error) => {
			console.log("call to api/password_reset/reset_password/confirm failed");
		});
	}

	static forgotPassword(email, callback) {
		if ($.ajaxSettings && $.ajaxSettings.headers) {
			delete $.ajaxSettings.headers.Authorization;
		}
		$.post(
			`${URL}/api/password_reset/`,
			{
				email,
			},
			(data, success) => {
				callback(data, success);
			}
		);
	}
}

export default Api;
