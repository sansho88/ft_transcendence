'use client'
import React, { useEffect,useContext, useState } from 'react'

import * as apiReq from '@/components/api/ApiReq'
import * as POD from "@/shared/types";
import {LoggedContext, SocketContextChat, SocketContextGame, UserContext} from '@/context/globalContext';
import LoadingComponent from "@/components/waiting/LoadingComponent";
import { getUserMe } from '../auth/Auth';
import * as ClipLoader from 'react-spinners'
import { useRouter } from 'next/navigation';




export default function Callback() {

	const {userContext, setUserContext} = useContext(UserContext);
	const {setLogged} = useContext(LoggedContext);
	// const [isLogged, setIsLogged] = useState<boolean | null>(null);
	const socketChat = useContext(SocketContextChat);
	const socketGame = useContext(SocketContextGame);
	const [isSignInMode, setIsSignInMode] = useState(false);

	const router = useRouter();


	enum authErrorState{
		emptyLogin,
		emptyPassword,
		loginNotFound ,
		badPassword = 401,
		loginAlreadyTaken = 409
	}

	const LoggedFailed = (errorCode) => {
		let errMsg: string;
		console.log("error code: " + errorCode);

		switch (errorCode) {
				case authErrorState.emptyLogin: errMsg = "The login is empty"; break;
				case authErrorState.emptyPassword: errMsg = "The password is empty"; break;
				case authErrorState.loginNotFound: errMsg = "This login doesn't exist"; break;
				case authErrorState.badPassword: errMsg = "The login and the password don't match"; break;
				case authErrorState.loginAlreadyTaken: errMsg = "This login is already taken"; break;
				default: errMsg = "Something wrong happened";
		}
		alert(errMsg);
		return (
				<>{<div className="flex flex-col items-center text-center text-red-600">
								<p>Error:</p>
								<p>Wrong, the login and password do not match.</p>
								<ClipLoader.PacmanLoader color='#07C3FF' size={30}/>
						</div>}
				</>
		);
}

 const fetchData = async (code :string) => {
	const code2FA = sessionStorage.getItem('code2FA');
	if (code2FA) sessionStorage.removeItem('code2FA');
	await apiReq.postApi.postTryLogin42(code, code2FA)
	.then(async (res) => {
		console.log(`ret tryLogin42: ${JSON.stringify(res)}`)
			if (res.status === 200) {
					const userToken = res.data;
					localStorage.removeItem('token');
					localStorage.setItem('token', userToken);
					apiReq.authManager.setToken(userToken);
					router.push('/home');
		}
	})
	.catch((e) => {
			// LoggedFailed(e.response.status); // pas adapter car dit mdp incoorect si echoue
			router.push('/auth');
			return;
		})
	return;

 }

	useEffect(()=> {
		const recupURL = new URLSearchParams(window.location.search);
		const code = recupURL.get('code');

		console.log('code = <' + code + '>');
		if (!code) router.push('/auth');
		//FAIRE LA REQUETE API pour obtenir le token
		if (code !== null)
		{ 
			fetchData(code);
		}

		
		
		
		//si success routrer vers home
	}, [])
	return (
			<LoadingComponent/>
	)
}
