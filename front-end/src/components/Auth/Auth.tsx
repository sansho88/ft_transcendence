'use client'

import {ChangeEvent, useContext, useEffect, useState} from 'react'
import  InputPod  from '@/components/(ben_proto)/login/InputPod'
import * as POD  from "@/shared/types";
import {deleteApi, getApi} from '@/components/api/ApiReq'
import * as apiReq from '@/components/api/ApiReq'
import * as ClipLoader from 'react-spinners'


import './auth.css'
import { useRouter } from 'next/navigation';
import { UserContext, LoggedContext } from '@/context/globalContext';
// import { Button } from '@/components/CustomButtonComponent'

//FIXME: le re logging ne fonctionne pas bien, ne recupere les infos pour userContext = donner vide

enum EAuthMod {
	api42,
	invitMod
}

enum EStepLogin {
	init,
	start,
	enterLogin,
	enterPassword,
	tryLogin,
	loading,
	successLogin,
	failLogin,
	errorLogin,
	bye
}

export default function Auth({className}: {className?: string}) {
	
	const {userContext, setUserContext} = useContext(UserContext);
	const { setLogged } = useContext(LoggedContext);
	// const [isLogged, setIsLogged] = useState<boolean | null>(null);



	useEffect(() => {
		console.log('UseEffect : userContext.login = ' + userContext?.login + ' pass: ' + userContext?.password);	
	}, [userContext]);

	const [currentStepLogin, setCurrentStepLogin] = useState<EStepLogin>(EStepLogin.start)

	
	////////////////////////////////////////////////////////
	////////////////// GESTION DES INPUTS //////////////////
	////////////////////////////////////////////////////////
	const [loginInput, setLoginInput] = useState<string>('');
	const [login, setLogin] = useState<string>('');
	



	const [passwordInput, setPasswordInput] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	

	
	////////////////////////////////////////////////////////
	//////////////// INPUT SWITCH DISPLAY //////////////////
	////////////////////////////////////////////////////////

	const enterLogin = () => {
		return (
			<div className='flex flex-col justify-center items-center'>
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
			</div>
		)
	}
	
	const enterPassword = () => {
		return (
			<div className='flex flex-col justify-center items-center'>
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
				{isLoginAlreadyExist ? 
					<div className=' font-thin'>{login} : Enter your password</div> :
					<div className=' font-thin'>Create password</div> 
				}
			</div>
		)
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
		}, 5000); // 3000 ms = 3 secondes
		return () => clearTimeout(timer);
	}, [currentStepLogin, router]);

	const LoggedSuccess = () => {
		return (
			<div className="flex flex-col items-center text-center">
      {showMessage && (
        <>
          <p>Congratulations, you are now logged in!</p>
          <p>Enjoy playing! </p>
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
		const router = useRouter();
		// setLogin(''); setLoginInput('');
		setPassword(''); setPasswordInput('');
		setBouttonText(textInviteModeButton)
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
const [buttonText, setBouttonText] = useState<string>(textInviteModeButton);
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
			
			case EStepLogin.enterLogin:
				console.log('enterLogin'); 
				setBouttonText('NEXT')
				return;
				
			case EStepLogin.enterPassword:
				setBouttonText('VALIDATE')
				if(loginInput.trim().length === 0){
					console.log('Login is empty'); 
					return;
				}
				const loginTrimmed = loginInput.trim().toString();
				setLogin(loginTrimmed);
				const req: boolean = await apiReq.utilsCheck.isLoginAlreadyTaken(loginTrimmed);
				if (req){
					setLoginAlreadyExist(true);
				}

				if(passwordInput === ''){
					console.log('No pass, return'); 
					return;
				}
				setPassword(passwordInput);
				break;
			case EStepLogin.tryLogin:
				if(isLoginAlreadyExist) {
					const req = await apiReq.utilsCheck.isPasswordMatch(login, password);
					if (req)
					{
						apiReq.getApi.getUserByLogin(login)
						.then((res) => {
							const newUser: POD.IUser = res
							setUserContext(newUser);
							setLogged(true);
							setCurrentStepLogin(EStepLogin.successLogin);
							console.log('your are now logged in')
						})
						.catch((e)=> {console.log(e); return;})
						return;
					}
					else{
						setCurrentStepLogin(EStepLogin.failLogin);
						nextStepCheck()
						console.log('your not logged, wrong password')
					}
				}
				else {
					const createUser: Partial<POD.IUser> = {login: login, password: password}
					await apiReq.postApi.postUser(createUser)
					.then((res) => {
						if (res.status === 201)
						{
							const newUser: POD.IUser = res.data
							console.log(`res 201, newUser= ${newUser.login} | pass hashed: ${newUser.password}`);
							setUserContext(newUser);
							// localStorage.setItem('login', newUser.login);
							// localStorage.setItem('pass', newUser.password); //cookie ?

							setLogged(true);
							setCurrentStepLogin(EStepLogin.successLogin);
						}
					})
				}
			return;
		}
	}
	fetchData();
	console.log('currentStep= ' + currentStepLogin)
	}, [currentStepLogin])


	function nextStepCheck(){
		switch(currentStepLogin){
			case EStepLogin.start:
				setCurrentStepLogin(EStepLogin.enterLogin);
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
					if(passwordInput.length === 0){
						return;
					}
					else{
						setPassword(passwordInput);
						setCurrentStepLogin(EStepLogin.tryLogin)
					}
			case EStepLogin.tryLogin:


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
				{currentStepLogin === EStepLogin.enterLogin 		&& enterLogin()}
				{currentStepLogin === EStepLogin.enterPassword 	&& enterPassword()}
				{currentStepLogin === EStepLogin.tryLogin 			&& <ClipLoader.BeatLoader className='pt-[12vh]' color="#36d7b7"	size={13}/> 
																													}
				{currentStepLogin === EStepLogin.successLogin 	&& LoggedSuccess()}
				{currentStepLogin === EStepLogin.failLogin 			&& LoggedFailed()}
				{currentStepLogin < EStepLogin.tryLogin 				&&
					<button onClick={() => nextStepCheck()} className='button-login h-14'>{buttonText}</button>}
			</div>

	)
}

