'use client'

import {useContext, useEffect, useState} from 'react'
import  InputPod  from '@/components/(ben_proto)/login/InputPod'
import * as POD  from "@/shared/types";
import * as apiReq from '@/components/api/ApiReq'
import * as ClipLoader from 'react-spinners'
import './auth.css'

import { useRouter } from 'next/navigation';

import Axios from '@/components/api/AxiosConfig';
import {UserContext, LoggedContext, SocketContextChat, SocketContextGame, TokenContext} from '@/context/globalContext';
import Button from "@/components/CustomButtonComponent";
import {IUser} from "@/shared/types";
import {axiosInstance} from "@/components/api/ApiReq";
import {authManager} from "@/components/api/ApiReq";


// import { Button } from '@/components/CustomButtonComponent'

//FIXME: le re logging ne fonctionne pas bien, ne recupere les infos pour userContext = data user vide

enum EAuthMod {
	api42,
	invitMod
}

enum EStepLogin {
	init,
	start,
	tryLoginAsInvite,
	signOrLogIn,
	signIn,
	logIn,
	enterLogin,
	enterPassword,
	tryToCreateAccount,
	tryToConnect,
	loading,
	successLogin,
	failLogin,
	errorLogin,
	bye
}

export async function getUserMe() {
	try {
		return await apiReq.getApi.getMe()
						.then((req) => {
							console.log("[Get User Me]",req.data.login);
							return req.data as IUser;
						});

	} catch (error) {
		console.error("[Get User Me ERROR]",error);
	}
}

export default function Auth({className}: {className?: string}) {





	const {userContext, setUserContext} = useContext(UserContext);
	const { setLogged } = useContext(LoggedContext);
	// const [isLogged, setIsLogged] = useState<boolean | null>(null);
  const socketChat = useContext(SocketContextChat);
  const socketGame = useContext(SocketContextGame);
  const [areCredentialsValids, setAreCredsValids] = useState(false);
  const { token, setToken } = useContext(TokenContext);
  const [isSignInMode, setIsSignInMode] = useState(false);

  
	useEffect(() => {
		console.log('UseEffect : userContext.login = ' + userContext?.login + ' pass: ' + userContext?.password);	
	}, [userContext]);

	const [currentStepLogin, setCurrentStepLogin] = useState<EStepLogin>(EStepLogin.start);


	////////////////////////////////////////////////////////
	////////////////// GESTION DES INPUTS //////////////////
	////////////////////////////////////////////////////////
	const lastUserLogin = localStorage.getItem("login");
	const lastUserPW = localStorage.getItem("password");
	const [loginInput, setLoginInput] = useState<string>(lastUserLogin == null ? '' : lastUserLogin);
	const [login, setLogin] = useState<string>(lastUserLogin == null ? '' : lastUserLogin);
	
	const [passwordInput, setPasswordInput] = useState<string>('');
	const [password, setPassword] = useState<string>('');


	// Créer une instance Axios avec des en-têtes d'authentification par défaut

	////////////////////////////////////////////////////////
	//////////////// INPUT SWITCH DISPLAY //////////////////
	////////////////////////////////////////////////////////

	const askForLogOrSignIn = () => {
	  return (
		  <div>
			  <button type="button" onClick={() => {setCurrentStepLogin(EStepLogin.signIn)}} className={"button-login"}>
              <span className="text">SIGN IN</span></button>
              <button type="button" onClick={() => {setCurrentStepLogin(EStepLogin.logIn)}} className={"button-login"}>
              <span className="text">LOG IN</span></button>
		  </div>
	  )
	}

	const enterLogin = () => {
		return (
			<div className='flex flex-col justify-center items-center text-white'>
				<InputPod
					className='inputLogin'
				props=
				{
					{	type: "text",
						value: loginInput,
						onChange: () => (e: React.ChangeEvent<HTMLInputElement>) =>{setLoginInput(e.target.value)},
						onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
						if (e.key === "Enter") {
							() => nextStepCheck()}}

					}
				}/>
				<div className=' font-thin'>Enter login</div>
				{}
				{enterPassword()}
			</div>
		)
	}

	const enterPassword = () => {

		return (
			<div className='flex flex-col justify-center items-center text-white'>
				<InputPod
				className='inputLogin'
				props=
				{
					{	type: "password",
						value: passwordInput,
						onChange: () => (e: React.ChangeEvent<HTMLInputElement>) =>{setPasswordInput(e.target.value)},
						onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
						if (e.key === "Enter") {
							setCurrentStepLogin(currentStepLogin); }}
					}
				}
				/>
				{currentStepLogin === EStepLogin.logIn ?
					<div className=' font-thin'>Enter your password</div> :
					<div className=' font-thin'>Create password</div> 
				}
				<button onClick={() => {
					setCurrentStepLogin(currentStepLogin === EStepLogin.logIn ?
					EStepLogin.tryToConnect : EStepLogin.tryToCreateAccount)
					setCredentials();
					}} className='button-login h-14'>CONNECT</button>

			</div>
		)
	}

	/*async function getUserMe() {
		try {
			return await apiReq.getApi.getMe()
				.then((req) => {
				console.log("[Get User Me]",req.data.login);
				return req.data as IUser;
			});

		} catch (error) {
			console.error("[Get User Me ERROR]",error);
		}
	}*/
	function setCredentials(){


		if(loginInput.trim().length === 0){
			console.log('Login is empty');
			return;
		}
		const loginTrimmed = loginInput.trim().toString();
		/*console.log("[setCredentials] loginTrimmed = ", loginTrimmed);*/
		setLogin(loginTrimmed);
		/*const req: boolean = await apiReq.utilsCheck.isLoginAlreadyTaken(loginTrimmed);
        if (req){
            setLoginAlreadyExist(true);
        }*/

		if(passwordInput === ''){
			console.log('No pass, return');
			return;
		}
		setPassword(passwordInput);
		console.log(`[SetCredentials]login: ${login}, password: ${password}`)
		alert(`[SetCredentials]login: ${login}, password: ${password}`)
		setAreCredsValids((login && password).length != 0);
		//getUserMe().then((req)=> console.log("GET ME LOGIN REQ:" + req));
	}

	const welcomeTitle = () => {
		return (
		<>
		<div className="welcome space-y-10 ">
						<div className="welcome-msg">WELCOME TO</div>
						{/*<div className="width: 788px; height: 130px; left: 0px; top: 24px; position: absolute; justify-content: center; align-items: center; display: inline-flex">*/}
						<div className="welcome-title">PONG POD!</div>
					</div>
		</>
		)
	}

	// const [showSuccessMessage, setShowSuccessMessage] = useState(true);
	// const [showFailMessage, setShowFailMessage] = useState(true);

	const [showMessage, setShowMessage] = useState(true);
	const [showMessageFail, setShowMessageFail] = useState(true);
	const router = useRouter();

	useEffect(() => {
		if (currentStepLogin !== EStepLogin.successLogin) {
			return;
		}
		const timer = setTimeout(() => {
			setShowMessage(false);
			setCurrentStepLogin(EStepLogin.bye)
			router.push('/'); //executer apres le timeout
		}, 650); // 3000 ms = 3 secondes
		return () => clearTimeout(timer);
	}, [currentStepLogin, router]);

	const LoggedSuccess = () => {
/*
    socketChat?.connect();
    socketGame?.connect();
    */
		return (
			<div className="flex flex-col items-center text-center">
      {showMessage && (
        <>
          <p className=' text-white'>Congratulations, you are now logged in!<br/>Enjoy playing!</p>
          <ClipLoader.PacmanLoader color='#07C3FF' size={30}/>
        </>
      )}
    </div>
		);
	}

	//TODO: fait une page ou popup qui indique lerreur pendant 3 secondes avant de retourner au debut
	// useEffect(() => {
	// 	if (currentStepLogin !== EStepLogin.failLogin) {
	// 		return;
	// 	}
	// 	const timer = setTimeout(() => {
	// 		setShowMessage(false);
	// 		setCurrentStepLogin(EStepLogin.start);
	// 	nextStepCheck();

	// 	}, 3000); // 3000 ms = 3 secondes
	// 	return () => clearTimeout(timer);
	// },[currentStepLogin]);

	const LoggedFailed = () => {
		// const [showMessage, setShowMessage] = useState(true);
		//const router = useRouter();
		// setLogin(''); setLoginInput('');
		setPassword(''); setPasswordInput('');
		setInviteButtonText(textInviteModeButton)
		alert('The login and password do not match.');

		setCurrentStepLogin(EStepLogin.start);
		// nextStepCheck();

		return (
			<>{ showMessageFail &&
			<div className="flex flex-col items-center text-center text-red-600">
          <p>Error:</p>
          <p>Wrong, the login and password do not match.</p>
          <ClipLoader.PacmanLoader color='#07C3FF' size={30}/>
    </div>}
			</>
		);
	}

		
	useEffect(() => {
		if(login.length > 0){
			console.log(`login = ${login}`);
		}
		else{

			// console.log(`login = VIDE`);	
		}

		if(password.length > 0){
			let nb:number = password.length
		let ret:string = '';
		for(let i = 0; i < nb; i++)
		ret += '❓️';
		console.log(`password = ${ret}`);
		// console.log(`password = ${password}`);//affiche mdp en clair 🫠
	}
}, [password, login]);

const textInviteModeButton:string = 'INVITE MODE'
const textSignInButton:string = 'SIGN IN'
const textLogInButton:string = 'LOG IN'
const [inviteButtonText, setInviteButtonText] = useState<string>(textInviteModeButton);
const [signInButtonText, setSignInButtonText] = useState<string>(textSignInButton);
const [logInButtonText, setLogInButtonText] = useState<string>(textLogInButton);
const [isLoginAlreadyExist, setLoginAlreadyExist] = useState<boolean>(false);


useEffect(() => {
	const fetchData = async () => {
		switch(currentStepLogin){
			case EStepLogin.start:
			// setLoginInput("");
			// setLogin("");
			// setCurrentStepLogin(EStepLogin.enterLogin)
			// console.log('Change step enterLogin => trylogin')
			break;

			case EStepLogin.signOrLogIn:
				console.log("Asked for sign in or Log in");
				break;


			case EStepLogin.enterLogin:
				console.log('enterLogin'); 
				setInviteButtonText('NEXT')
				return;
				
			case EStepLogin.enterPassword:
				setInviteButtonText('VALIDATE')
				if(loginInput.trim().length === 0){
					console.log('Login is empty'); 
					return;
				}
				const loginTrimmed = loginInput.trim().toString();
				setLogin(loginTrimmed);
				/*const req: boolean = await apiReq.utilsCheck.isLoginAlreadyTaken(loginTrimmed);
				if (req){
					setLoginAlreadyExist(true);
				}*/

				if(passwordInput === ''){
					console.log('No pass, return'); 
					return;
				}
				setPassword(passwordInput);
				break;
			case EStepLogin.tryToConnect: //todo: "LOG IN" et "SIGN IN"
				//if(isLoginAlreadyExist) {
					/*const req = await apiReq.utilsCheck.isPasswordMatch(login, password);*/
				console.log(`[TRY LOGIN] login: ${login}, pass: ${passwordInput}`);
				const existingUser: Partial<POD.IUser> = {login: login, password: passwordInput, visit: true}
				await apiReq.postApi.postTryLogin(existingUser)
					.then(async (res) => {

						if (res.status === 200) {
							const userToken = res.data;
							localStorage.removeItem('token');
							localStorage.setItem('token', userToken);
							authManager.setToken(userToken);

							setUserContext( await getUserMe());
							setLogged(true);
							setCurrentStepLogin(EStepLogin.successLogin);
							localStorage.setItem('login', login);
							localStorage.setItem('userContext', JSON.stringify(userContext))
							console.log(localStorage.getItem(JSON.parse('userContext')));
							console.log('you are now logged in')
						}
						})
						.catch((e)=> {console.log(e); return;})
						return;

				//}
			case EStepLogin.tryToCreateAccount:
				console.log(`at case: TryToCreateAccount: login: ${login}, password: ${password}`)
				const createUser: Partial<POD.IUser> = {login: login, password: password, visit: true}
					await apiReq.postApi.postUser(createUser)
					.then(async (res) => {
						if (res.status === 200)
						{
							const userToken = res.data;
							console.log(`Token: ${res.data}`);
							localStorage.removeItem('token');
							localStorage.setItem('token', userToken);
							authManager.setToken(userToken);
							localStorage.setItem("login", login);
							const futureUser = await getUserMe();
							console.log("[postUser futureUser] nickname:" + futureUser.nickname + ", id: " + futureUser.UserID);
							setUserContext( futureUser);
							setLogged(true);
							/*.then((reqUser) => 	{
                                console.log("USER in Database POST creation: ", reqUser.login);
                                if (reqUser.login != undefined)
                                    setUserContext(reqUser);
                            })*/

							setCurrentStepLogin(EStepLogin.successLogin);
						}
					})
						.catch((e) => console.error("Post User: " + e, `createUser= ${createUser.login}, ${createUser.visit}`));
			return;
		}
	}
	fetchData();
	console.log('currentStep= ' + currentStepLogin)
	}, [currentStepLogin])


	function nextStepCheck(){
		switch(currentStepLogin){
			case EStepLogin.start:
				setCurrentStepLogin(EStepLogin.signOrLogIn);
				break;
			case EStepLogin.enterLogin:

				if(loginInput.trim().length === 0){
					console.log('Login is empty'); 
					return;
				}
				else{
					setCurrentStepLogin(EStepLogin.enterPassword)
				}
				break;
			case EStepLogin.enterPassword:
				console.log( "Enter Password: ", passwordInput);
					if(passwordInput.length === 0){
						return;
					}
					else{
						setPassword(passwordInput);
						setCurrentStepLogin( isSignInMode ? EStepLogin.tryToCreateAccount: EStepLogin.tryToConnect)
					}
					break;

			case EStepLogin.signIn:
				setIsSignInMode(true);
				setCurrentStepLogin(EStepLogin.enterLogin);
				break;
			case EStepLogin.tryLoginAsInvite:


		}
	}

	let defaultClassName: string;
	if(!className || className.trim().length === 0){
		defaultClassName = 'flex flex-col items-center p-5 font-semibold text-xl space-y-10 pt-[25vh]';
	} 
	else
		defaultClassName = className;



	return (
			<div className={defaultClassName}>
				{/* <div>PROTOTYPE - LOGIN PAGE	</div> */}
				{welcomeTitle()}
				{currentStepLogin === EStepLogin.start 					&& 
					<button onClick={() => console.log('Not implemented')} className='button-login h-14 opacity-30'>LOGIN 42</button>}
				{currentStepLogin < EStepLogin.tryLoginAsInvite 				&&
					<button onClick={() => nextStepCheck()} className='button-login h-14'>{inviteButtonText}</button>}
				{currentStepLogin === EStepLogin.signOrLogIn && askForLogOrSignIn()}
				{currentStepLogin === EStepLogin.enterLogin  && enterLogin()}{/*
				{currentStepLogin === EStepLogin.enterPassword 	&& enterPassword()}*/}
				{(currentStepLogin === EStepLogin.signIn || currentStepLogin === EStepLogin.logIn) && enterLogin()}

				{currentStepLogin === EStepLogin.signOrLogIn 			&& <ClipLoader.BeatLoader className='pt-[12vh]' color="#36d7b7" size={13}/>
																													}
				{currentStepLogin === EStepLogin.successLogin 	&& LoggedSuccess()}
				{currentStepLogin === EStepLogin.failLogin 			&& LoggedFailed()}

			</div>

	)
}

