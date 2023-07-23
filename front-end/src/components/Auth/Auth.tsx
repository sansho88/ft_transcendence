'use client'

import './auth.css'

import {useContext, useEffect, useState} from 'react'
import  InputPod  from '@/components/login/InputPod'
import { POD } from '@/types/types'
import  {getApi} from '@/components/api/ApiReq'
// import { Button } from '@/components/CustomButtonComponent'

enum EAuthMod {
	api42,
	invitMod
}

enum EStepLogin {
	start,
	enterLogin,
	loginIsEnter,
	enterPassword,
	passwordIsEnter,
	tryLogin,
	successLogin,
	errorLogin,
}


export default function Auth() {

	
	const [currentStepLogin, setCurrentStepLogin] = useState<EStepLogin>(EStepLogin.start)
	
	////////////////////////////////////////////////////////
	////////////////// GESTION DES INPUTS //////////////////
	////////////////////////////////////////////////////////
	const [loginDisplay, setLoginDisplay] = useState<string>('');
	const [login, setLogin] = useState<string>('');
	
	
	const inputLogin: POD.IInput = {
		type: "text",
		value: loginDisplay,
		onKeyDown: (e) => {
			if (e.key === "Enter") {
				console.log('Press enter go to pass input');
				setCurrentStepLogin(EStepLogin.enterPassword)
			}
		},
		onChange: (e: any) => {
			setLogin(e.target.value);
		}
	}


	const [passwordDisplay, setPasswordDisplay] = useState<string>('');
	const [passwordInput, setPasswordInput] = useState<string>('');
	
	const inputPassword: POD.IInput = {
		type: "text",
		value: passwordDisplay,
		onKeyDown: (e) => {
			if (e.key === "Enter") {
				console.log('Press enter, go to tryLogin');
			}
		},
		onChange: (e: any) => {
			setLogin(e.target.value);
		}
	}
	
	
	////////////////////////////////////////////////////////
	//////////////// INPUT SWITCH DISPLAY //////////////////
	////////////////////////////////////////////////////////

	
	
	const choiceAuthMod = () => {
		return (
			<div className='flex flex-col justify-center items-center'>
				<div className=' font-thin'>Enter login</div>
			</div>
		)
	}
	

	
	const enterLogin = () => {
		return (
			<div className='flex flex-col justify-center items-center'>
				<InputPod props={inputLogin} className='inputLogin'/>
				<div className=' font-thin'>Enter login</div>
			</div>
		)
	}
	
	
	const enterPassword = () => {
		return (
			<div className='flex flex-col justify-center items-center'>
				<InputPod props={inputPassword} className='inputLogin'/>
				<div className=' font-thin'>Enter password</div>
			</div>
		)
	}


	
	const [buttonText, setBouttonText] = useState<string>('INVITE MODE')
	
	const handleValidation = () => {
		switch (currentStepLogin) {
			case EStepLogin.start:
				setCurrentStepLogin(EStepLogin.enterLogin);
				setBouttonText('NEXT')
				break;
				case EStepLogin.enterLogin:
					if (loginDisplay.trim().length === 0)
					{
						console.log('loginDiplay='+ loginDisplay)
						alert('login is empty');
						return;
					}
					setLogin(loginDisplay);
					setCurrentStepLogin(EStepLogin.enterPassword);
					setBouttonText('LOGIN')
				break;
			case EStepLogin.enterPassword:
				setCurrentStepLogin(EStepLogin.tryLogin);
				break;
		}
	};
	
	const [displayContent, setDisplayContent] = useState<JSX.Element>(<></>)

	useEffect(() => {
		
	}, [displayContent])

 function test(){
		getApi.getUsersAll()
		.then((res) => {
			if(res.status === 200)
				console.log(res.data);
		})
		// console.log('No Implemented')
}


	// const {isLogged, setIsLogged} = useContext(context)
	return (

			<div className="flex flex-col justify-center items-center p-5 font-semibold text-xl space-y-10">
				<div>PROTOTYPE - LOGIN PAGE	</div>
				{currentStepLogin === EStepLogin.enterLogin && enterLogin()}
				{currentStepLogin === EStepLogin.enterPassword && enterPassword()}
				{currentStepLogin === EStepLogin.tryLogin && enterPassword()}
				{currentStepLogin === EStepLogin.start &&
						<button onClick={() => test()} className='button-login h-14 opacity-30'>LOGIN 42</button>}
				<button onClick={handleValidation} className='button-login h-14'>{buttonText}</button>
			</div>

	)
}
