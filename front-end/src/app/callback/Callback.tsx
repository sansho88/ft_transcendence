'use client'
import React, { useEffect} from 'react'

import * as apiReq from '@/components/api/ApiReq'
import LoadingComponent from "@/components/waiting/LoadingComponent";
import * as ClipLoader from 'react-spinners'
import { useRouter } from 'next/navigation';
import { NotificationManager } from 'react-notifications';




export default function Callback() {
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
			if (res.status === 200) {
					const userToken = res.data;
					localStorage.removeItem('token');
					localStorage.setItem('token', userToken);
					apiReq.authManager.setToken(userToken);
					router.push('/home');
		}
	})
	.catch((error) => {
		  
			if (localStorage.getItem('token') !== null) return router.push('/home');
			alert("2FA is required for this account");
			localStorage.removeItem('token');
			router.push('/auth');
			return;
		})
	return;

 }

	useEffect(()=> {
		const recupURL = new URLSearchParams(window.location.search);
		const code = recupURL.get('code');

		if (!code) router.push('/auth');
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
