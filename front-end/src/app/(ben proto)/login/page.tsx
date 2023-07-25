"use client";

import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";
import {OriginContext} from "@/context/globalContext";
import * as POD from "@/shared/types";
import {LoggedContext, UserContext} from "@/context/globalContext";



enum EStepLogin {
	enterUsername,
	enterPassword,
	tryLoggin,
	successLogin,
	errorLogin,
}

export default function Page() {
	const originApi = useContext<POD.IOriginNetwork>(OriginContext).apiDOM;
	const {userContext, setUserContext} = useContext(UserContext);
	
	const { setLogged } = useContext(LoggedContext);
	const [isLogged, setIsLogged] = useState<boolean | null>(null);
	
	const [isLoading, setIsLoading] = useState(false);
	const [userReponse, setUserReponse] = useState<string | null>(null);
	
	const [username, setUsername] = useState<string>("");
	const [usernameInput, setUsernameInput] = useState<string>("");

	const [password, setPassword] = useState<string>("");
	const [passwordInput, setPasswordInput] = useState<string>("");

	const [stepLogin, setStepLogin] = useState<EStepLogin>(
		EStepLogin.enterUsername
	);

	const router = useRouter();

	useEffect(() => {
		if (username) {
			console.log('username =' + username)
			axios
				.get(`${originApi}/api/users/login/${username}`)
				.then((response) => {
					setUserReponse(response.status === 200 ? null : "User not found");
				})
				.catch((e) => {
					setUserReponse("Error fetching user");
				});
		}
	}, [username]);

	const enterUsername = () => {
		if (username.trim().length !== 0) {
			setStepLogin(EStepLogin.enterPassword);
		}
	};

	const enterPassword = () => {
		if (password.trim().length !== 0) {
			setStepLogin(EStepLogin.tryLoggin);
		}
	};

	async function tryLoggin(pass: string) {
		const user: POD.IUser = {
			login: username,
			nickname: username,
			password: pass,
			avatar_path: "base.png",
			status: 1,
			token_2fa: pass, //TODO: switch dans reel pass
			has_2fa: false,
		};

		if (userReponse) {
			axios
				.post(`${originApi}/api/users`, user)
				.then((response) => {
					if (response.status === 201) {setIsLogged(true); setLogged(true); setUserContext(user);router.push(`/profile/${username}`);}
				})
				.catch((error) => {
					console.error("Error during login:", error);
				});
		} else {
			axios
				.post(`${originApi}/api/users/login`, {
					username: user.login,
					password: user.token_2fa,
				})
				.then((reponse) => {
					if (reponse.status === 201) {setIsLogged(true); setLogged(true); setUserContext(user);}
					else {
						router.push(`/`);
					}
					return;
				});
		}
	}

	useEffect(() => {
		switch (stepLogin) {
			case EStepLogin.enterUsername:
				enterUsername();
				break;
			case EStepLogin.enterPassword:
				enterPassword();
				break;
			case EStepLogin.tryLoggin: // ne marche pas bien pour le moment => deplacement direct dans le onClick event
				tryLoggin(password);
				break;
		}
	}, [username]);

	useEffect(() => {
		if (isLogged === true) {
			router.push(`/profile/${username}`);
		}
	}, [isLogged]);

function step1() {
	return (
	<>
		<input
							type="text"
							value={usernameInput}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									setUsername(usernameInput.trim().toString());
									setStepLogin(EStepLogin.enterPassword);
								}
							}}
							onChange={(e) => setUsernameInput(e.target.value)}
							className="bg-neutral-800 text-red-500 flex-grow rounded-lg h-8 p-4"
						/>
						<button onClick={() => setUsername(usernameInput.trim().toString())} className="ml-5">
							USERNAME
						</button>
		</>)
}


	return (
		<>
			<div className="flex justify-center p-5 font-semibold text-xl">
				PROTOTYPE - LOGIN PAGE
			</div>
			<div className="flex flex-col items-center justify-center p-6">
				{stepLogin === EStepLogin.enterUsername ? (
					<>
					{step1()}
						{/* <input
							type="text"
							value={usernameInput}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									setUsername(usernameInput.trim().toString());
									setStepLogin(EStepLogin.enterPassword);
								}
							}}
							onChange={(e) => setUsernameInput(e.target.value)}
							className="bg-neutral-800 text-red-500 flex-grow rounded-lg h-8 p-4"
						/>
						<button onClick={() => setUsername(usernameInput.trim().toString())} className="ml-5">
							USERNAME
						</button> */}
					</>
				) : (
					<>
						<input
							type="text"
							value={passwordInput}
							onChange={(e) => setPasswordInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									setPassword(passwordInput.trim().toString());
									setStepLogin(EStepLogin.tryLoggin);
									setIsLoading(true);
									try {
										tryLoggin(passwordInput.trim().toString());
									} catch (error) {
										console.error(error);
									}
									setIsLoading(false);
								setPasswordInput("");
								}
							}}
							className="bg-neutral-800 text-red-500 flex-grow rounded-lg h-8 p-4"
						/>
						<button
							disabled={isLoading}
							onClick={async () => {
								console.log(`password value = ${passwordInput}`);
								setPassword(passwordInput);
								setStepLogin(EStepLogin.tryLoggin);
								setIsLoading(true);
								try {
									await tryLoggin(passwordInput.trim().toString());
								} catch (error) {
									console.error(error);
								}
								setIsLoading(false);
								setPasswordInput("");
							}}
							className="ml-5"
						>
							{isLoading
								? "CHARGEMENT"
								: stepLogin !== EStepLogin.tryLoggin
								? userReponse === null
									? "ENTER YOUR PASSWORD"
									: "SET A PASSWORD"
								: "CHARGEMENT"}
							<br />
							 
						</button>
							<br />
							system temporaire (les pass sont hash, stocker dans token2FA)
							<br />
							<a href='http://localhost:8000/api/users' className="
							 text-blue-500 bg-slate-900 p-4 rounded-lg" target="_blank" rel="noopener noreferrer">	
							==>> localhost:/8000/api/users
</a>

					</>
				)}
			</div>
		</>
	);
}
