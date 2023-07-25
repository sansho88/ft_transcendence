'use client'

import {ChangeEvent, useContext, useEffect, useState} from 'react'
import  InputPod  from '@/components/login/InputPod'
import * as POD  from "@/shared/types";
import {deleteApi, getApi} from '@/components/api/ApiReq'
import * as apiReq from '@/components/api/ApiReq'
import * as ClipLoader from 'react-spinners'


import './auth.css'
import { useRouter } from 'next/navigation';
// import { Button } from '@/components/CustomButtonComponent'

enum EAuthMod {
	api42,
	invitMod
}

enum EStepLogin {
	start,
	enterLogin,
	enterPassword,
	tryLogin,
	loading,
	successLogin,
	failLogin,
	errorLogin,
}

export default function Auth({className}: {className?: string}) {


	
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
							handleValidation(EStepLogin.enterLogin); }}
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
							handleValidation(EStepLogin.enterPassword); }}
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

	const LoggedSuccess = () => {
		const [showMessage, setShowMessage] = useState(true);
		const router = useRouter();

		useEffect(() => {
			const timer = setTimeout(() => {
				setShowMessage(false);
				router.push('/'); //executer apres le timeout
			}, 3000); // 3000 ms = 3 secondes
			return () => clearTimeout(timer);
		},);

		return (
			<div className="flex flex-col items-center text-center">
      {showMessage && (
        <>
          <p>Congratulations, you are now logged in!</p>
          <p>We are now redirecting you to the game. Enjoy playing! </p>
          <ClipLoader.PacmanLoader color='#07C3FF' size={30}/>
        </>
      )}
    </div>
		);
	}

	//TODO: fait une page ou popup qui indique lerreur pendant 3 secondes avant de retourner au debut
	const LoggedFailed = () => {
		// const [showMessage, setShowMessage] = useState(true);
		const router = useRouter();
		alert('The login and password do not match.');
		setCurrentStepLogin(EStepLogin.start);

		//FIXME: Failed compile error
		// useEffect(() => {
		// 	const timer = setTimeout(() => {
		// 		setShowMessage(false);
		// 		setCurrentStepLogin(EStepLogin.start);
		// 	}, 3000); // 3000 ms = 3 secondes
		// 	return () => clearTimeout(timer);
		// },);
		return (
			<div className="flex flex-col items-center text-center text-red-600">
          <p>Error:</p>
          <p>Wrong, the login and password do not match.</p>
          <ClipLoader.PacmanLoader color='#07C3FF' size={30}/>
    </div>
		);
	}

	
	
	useEffect(() => {
		if(login.length > 0){
			console.log(`login = ${login}`);
			
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

const [buttonText, setBouttonText] = useState<string>('INVITE MODE');
const [isLoginAlreadyExist, setLoginAlreadyExist] = useState<boolean>(false);




async function handleValidation(step: EStepLogin) {
	switch(step){
		case EStepLogin.start:
			setLoginInput("");
			setPasswordInput("");
			setLogin("");
			setPassword('')

			setCurrentStepLogin(EStepLogin.enterLogin)
			setBouttonText('NEXT')
			// console.log('Change step enterLogin => trylogin')
			return;

		case EStepLogin.enterLogin:
				if(loginInput.trim().length === 0){
					console.log('Login is empty'); 
					return;
				}
				const loginTrimmed = loginInput.trim().toString();
				setLogin(loginTrimmed);

				//requete pour savoir si le login existe deja
				const req: boolean = await apiReq.utilsCheck.isLoginAlreadyTaken(loginTrimmed);
				if (req)
					setLoginAlreadyExist(true);
				
				setCurrentStepLogin(EStepLogin.enterPassword)
				setBouttonText('VALIDATE')
				// console.log('Change step enterLogin => enterPassword')
				return;
				
		case EStepLogin.enterPassword:
			if(passwordInput === ''){
				console.log('Password is empty'); 
				return;
			}
			setPassword(passwordInput);
			setCurrentStepLogin(EStepLogin.tryLogin)
			return;
		case EStepLogin.tryLogin:
			if(isLoginAlreadyExist) {
				const req = await apiReq.utilsCheck.isPasswordMatch(login, password);
				if (req)
				{
					console.log('your are now logged in')
					setCurrentStepLogin(EStepLogin.successLogin);
				}
				else{
					setCurrentStepLogin(EStepLogin.failLogin);
					console.log('your not logged, wrong password')
				}
			}
			break;
	}
}
	// const {isLogged, setIsLogged} = useContext(context)

	let defaultClassName: string;
	if(!className || className.trim().length === 0){
		defaultClassName = 'flex flex-col items-center p-5 font-semibold text-xl space-y-10 pt-[25vh]'
	} 
	else
		defaultClassName = className


	const [currentStepLogin, setCurrentStepLogin] = useState<EStepLogin>(EStepLogin.start)

	return (
			<div className={defaultClassName}>
				{/* <div>PROTOTYPE - LOGIN PAGE	</div> */}
				{welcomeTitle()}
				{currentStepLogin === EStepLogin.start 					&& 
					<button onClick={() => console.log('Not implemented')} className='button-login h-14 opacity-30'>LOGIN 42</button>}
				{currentStepLogin === EStepLogin.enterLogin 		&& enterLogin()}
				{currentStepLogin === EStepLogin.enterPassword 	&& enterPassword()}
				{currentStepLogin === EStepLogin.tryLogin 			&& <ClipLoader.BeatLoader className='pt-[12vh]' color="#36d7b7"	size={13}/> 
																													&& handleValidation(currentStepLogin)}
				{currentStepLogin === EStepLogin.successLogin 	&& LoggedSuccess()}
				{currentStepLogin === EStepLogin.failLogin 			&& LoggedFailed()}
				{currentStepLogin < EStepLogin.tryLogin 				&&
					<button onClick={() => handleValidation(currentStepLogin)} className='button-login h-14'>{buttonText}</button>}
			</div>

	)
}

