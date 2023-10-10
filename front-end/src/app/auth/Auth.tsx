'use client'

import {useContext, useEffect, useState} from 'react'
import InputPod from './InputPod'
import * as POD from "@/shared/types";
import {IUser} from "@/shared/types";
import * as apiReq from '@/components/api/ApiReq'
import {authManager} from '@/components/api/ApiReq'
import * as ClipLoader from 'react-spinners'
import './auth.css'
import {useRouter} from 'next/navigation';
import {LoggedContext, SocketContextChat, SocketContextGame, UserContext} from '@/context/globalContext';
import LoadingComponent from "@/components/waiting/LoadingComponent";
import {NotificationManager, NotificationContainer} from 'react-notifications';

// import { Button } from '@/components/CustomButtonComponent'
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
    check2FA,
    loading,
    successLogin,
    failLogin,
    errorLogin,
    bye
}

export async function getUserMe(userReceived: IUser | undefined) {
    try {
        userReceived = await apiReq.getApi.getMePromise()
            .then((req) => {
                return req.data as IUser;
            });
        return userReceived;

    } catch (error) {
        console.error("[Get User Me ERROR] Wrong token used. Trying to fix issue...", error);
        localStorage.clear();
        location.reload();
    }
}


export async function getUserFromLogin(login: string) {
    try {
        return await apiReq.getApi.getUserByLoginPromise(login)
            .then((req) => {
                return req.data as IUser;
            });

    } catch (error) {
        console.error("[Get User From Login ERROR]", error);
    }
}

export async function getUserFromId(id: number) {
    try {
        return await apiReq.getApi.getUserByIdPromise(id)
            .then((req) => {
                return req.data as IUser;
            });

    } catch (error) {
        console.error("[Get User From Login ERROR]", error);
    }
}

export default function Auth({className}: { className?: string }) {


    const {userContext, setUserContext} = useContext(UserContext);
    const {logged, setLogged} = useContext(LoggedContext);
    const [isSignInMode, setIsSignInMode] = useState(false);
    const router = useRouter();


    if (logged)
        router.push("/home");

    useEffect(() => {
        authManager.setBaseURL('http://' + window.location.href.split(':')[1].substring(2) + ':8000/api/');
        const tmpToken = localStorage.getItem('token');
        if (tmpToken)
        {
            console.log("Logged. Redirect to home.");
            authManager.setToken(tmpToken);
            router.push("/home");
        }
    })

    useEffect(() => {
        setUserContext({login:"", nickname:"", UserID:-1, avatar_path:undefined, visit:undefined, status:0, token_2fa:""});
    }, [isSignInMode]);

    const [currentStepLogin, setCurrentStepLogin] = useState<EStepLogin>(EStepLogin.start);


    ////////////////////////////////////////////////////////
    ////////////////// GESTION DES INPUTS //////////////////
    ////////////////////////////////////////////////////////

    const [loginInput, setLoginInput] = useState<string>("");
    const [login, setLogin] = useState<string>("");

    const [passwordInput, setPasswordInput] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    
    const [code2FAInput, setcode2FAInput] = useState<string>('');
    const [code2FA, setcode2FA] = useState<string>('');


    // Créer une instance Axios avec des en-têtes d'authentification par défaut

    ////////////////////////////////////////////////////////
    //////////////// INPUT SWITCH DISPLAY //////////////////
    ////////////////////////////////////////////////////////

    function connectUser(){
        setLogged(true);
        setCurrentStepLogin(EStepLogin.successLogin);
        localStorage.setItem('userContext', JSON.stringify(userContext));
    }

    const askForLogOrSignIn = () => {
        return (
            <div>
                <button type="button" onClick={() => {
                    setCurrentStepLogin(EStepLogin.signIn)
                }} className={"button-login my-8"}>
                    <span className="text">SIGN IN</span></button>
                <button type="button" onClick={() => {
                    setCurrentStepLogin(EStepLogin.logIn)
                }} className={"button-login"}>
                    <span className="text">LOG IN</span></button>
            </div>
        )
    }

    const enterLogin = () => {
        return (
            <div className='flex flex-col justify-center items-center text-white my-2'>
                {  currentStepLogin === EStepLogin.logIn ?
                    <>
                        <div className=' font-thin'>LOGIN</div>
                        <InputPod
                            className='inputLogin'
                            props=
                                {
                                    {
                                        type: "text",
                                        value: loginInput,
                                        onChange: () => (e: React.ChangeEvent<HTMLInputElement>) => {
                                            setLoginInput(e.target.value)
                                        },
                                        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                                            if (e.key === "Enter") {
                                                () => nextStepCheck()
                                            }
                                        }

                                    }
                                }
                        />
                    </>
                    :
                    <div className={"text-center"}>
                        Keep in minds your future generated login.<br/>
                        You'll need it for log in.
                    </div>
                }
                {enterPassword()}
            </div>
        )
    }

    const enterPassword = () => {

        return (
            <div className='flex flex-col justify-center items-center text-white my-8'>
                <InputPod
                    className='inputLogin'
                    props=
                        {
                            {
                                type: "password",
                                value: passwordInput,
                                onChange: () => (e: React.ChangeEvent<HTMLInputElement>) => {
                                    setPasswordInput(e.target.value)
                                },
                                onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                                    if (e.key === "Enter") {
                                        setCurrentStepLogin(currentStepLogin);
                                    }
                                }
                            }
                        }
                />
                {currentStepLogin === EStepLogin.logIn ?
                    <div className=' font-thin'>Enter your password</div> :
                    <div className=' font-thin'>Create password</div>
                }
                <button type="button" className={"button-login my-12 "} onClick={() => {
                    setCurrentStepLogin(currentStepLogin === EStepLogin.logIn ?
                        EStepLogin.tryToConnect : EStepLogin.tryToCreateAccount)
                    setCredentials();
                }}><span className="text">CONNECT</span></button>

                <button type="button" className={"button-login"} onClick={() => {
                    setLogin('');
                    setLoginInput('');
                    setPassword('');
                    setPasswordInput('');
                    setCurrentStepLogin(EStepLogin.signOrLogIn);
                }}><span className="text">CANCEL</span></button>

            </div>
        )
    }
    const enterCode2FA = () => {

        return (
            <div className='flex flex-col justify-center items-center text-white my-8'>
                <InputPod
                    className='inputLogin'
                    props=
                        {
                            {
                                type: "number",
                                value: code2FAInput,
                                onChange: () => (e: React.ChangeEvent<HTMLInputElement>) => {
                                    setcode2FAInput(e.target.value)
                                },
                                onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                                    if (e.key === "Enter") {
                                        setCurrentStepLogin(currentStepLogin);
                                    }
                                }
                            }
                        }
                />
                {
                    <div className=' font-thin'>Enter your 2FA Code</div>
                }
                <button type="button" className={"button-login my-12 "} onClick={() => {
                   if (code2FAInput == "424242")
                       connectUser();
                   else
                       NotificationManager.error("Invalid 2FA code");

                }}><span className="text">CONFIRM</span></button>

                <button type="button" className={"button-login"} onClick={() => {
                    setLogin('');
                    setLoginInput('');
                    setcode2FA('');
                    setcode2FAInput('');
                    setCurrentStepLogin(EStepLogin.signOrLogIn);
                }}><span className="text">CANCEL</span></button>

            </div>
        )
    }

    function setCredentials() {
        if (loginInput.trim().length === 0 && isSignInMode) {
            alert('Login is empty');
            setPassword('');
            setPasswordInput('');
            setCurrentStepLogin(EStepLogin.enterLogin);
            return;
        }
        const loginTrimmed = loginInput.trim().toString();

        setLogin(loginTrimmed);

        if (passwordInput === '') {
            alert("Password is empty");
            setLogin('');
            setLoginInput('');
            setCurrentStepLogin(EStepLogin.enterLogin);
            return;
        }
        setPassword(passwordInput);
    }

    const welcomeTitle = () => {
        return (
            <>
                <div className="welcome space-y-10 my-12">
                    <div className="welcome-msg">WELCOME TO</div>
                    {/*<div className="width: 788px; height: 130px; left: 0px; top: 24px; position: absolute; justify-content: center; align-items: center; display: inline-flex">*/}
                    <div className="welcome-title ">PONG POD!</div>
                </div>
            </>
        )
    }


    const [showMessage, setShowMessage] = useState(true);
    const [showMessageFail] = useState(true);


    useEffect(() => {
        if (currentStepLogin !== EStepLogin.successLogin) {
            return;
        }
        router.push('/');
        setShowMessage(false);
    }, [currentStepLogin, router]);

    const LoggedSuccess = () => {
        /*
            socketChat?.connect();
            socketGame?.connect();
            */
        return (
            <div className="flex flex-col items-center text-center">
                {showMessage && <LoadingComponent/>}
            </div>
        );
    }

    function backToHome() {
        setLogin('');
        setLoginInput('');
        setPassword('');
        setPasswordInput('');
        setCurrentStepLogin(EStepLogin.start);
    }

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
        backToHome();
        return (
            <>{showMessageFail &&
                <div className="flex flex-col items-center text-center text-red-600">
                    <p>Error:</p>
                    <p>Wrong, the login and password do not match.</p>
                    <ClipLoader.PacmanLoader color='#07C3FF' size={30}/>
                </div>}
            </>
        );
    }

/*
    useEffect(() => {
        if (login.length > 0) {
            console.log(`login = ${login}`);
        }
        if (password.length > 0) {
            let nb: number = password.length
            let ret: string = '';
            for (let i = 0; i < nb; i++)
                ret += '❓️';
            console.log(`password = ${ret}`);
        }
    }, [password, login]);*/

    const textInviteModeButton: string = 'INVITE MODE'
    const [inviteButtonText] = useState<string>(textInviteModeButton);


    useEffect(() => {
        let user;
        const fetchData = async () => {
            switch (currentStepLogin) {
                case EStepLogin.start:
                    break;

                case EStepLogin.enterPassword:
                    if (loginInput.trim().length === 0) {
                        console.log('Login is empty');
                        return;
                    }
                    const loginTrimmed = loginInput.trim().toString();
                    setLogin(loginTrimmed);
                    if (passwordInput === '') {
                        console.log('No pass, return');
                        return;
                    }
                    setPassword(passwordInput);
                    break;

                case EStepLogin.tryToCreateAccount:
                    const createUser: Partial<POD.IUser> = {login: "serverside", password: password, visit: true}
                    await apiReq.postApi.postUser(createUser)
                        .then(async (res) => {
                            if (res.status === 200) {
                                const userToken = res.data;
                                localStorage.removeItem('token');
                                localStorage.setItem('token', userToken);
                                authManager.setToken(userToken);
                                localStorage.setItem("login", login);
                                setUserContext(await getUserMe(user).then(() => {
                                        setLogged(true);
                                        setCurrentStepLogin(EStepLogin.successLogin);
                                    }
                                ));
                            }
                        })
                        .catch((e) => {
                            console.error("Post User ERROR: " + e, `createUser= ${createUser.login}, ${createUser.visit}`);
                            if (e.response)
                            {
                                console.error("Request made and server responded...");
                                console.error(e.response.data);
                                console.error(e.response.status);
                                console.error(e.response.headers);
                                LoggedFailed(e.response.status);
                            }
                            else if (e.request)
                            {
                                console.error("The request was made but no response was received");
                                console.error(e.request);
                            }
                            else
                                console.error(e.message);
                        });
                    return;

                case EStepLogin.tryToConnect:
                    const existingUser: Partial<POD.IUser> = {login: login, password: passwordInput, visit: true}
                    await apiReq.postApi.postTryLogin(existingUser)
                        .then(async (res) => {
                            if (res.status === 200) {
                                const userToken = res.data;
                                localStorage.removeItem('token');
                                localStorage.setItem('token', userToken);
                                authManager.setToken(userToken);

                                setUserContext(await getUserMe(user).then((me) => {
                                    if (me?.has_2fa)
                                    {
                                        setCurrentStepLogin(EStepLogin.check2FA);
                                    }
                                    else
                                        connectUser();

                                }));
                            }
                        })
                        .catch((e) => {
                            console.log("[TRY LOGIN ERROR]" + e);
                            LoggedFailed(e.response.status);
                            return;
                        })
                    return;
            }
        }
        fetchData();
    }, [currentStepLogin])


    function nextStepCheck() {
        switch (currentStepLogin) {
            case EStepLogin.start:
                setCurrentStepLogin(EStepLogin.signOrLogIn);
                break;
            case EStepLogin.enterLogin:

                if (loginInput.trim().length === 0) {
                    console.log('Login is empty');
                    return;
                } else {
                    setCurrentStepLogin(EStepLogin.enterPassword)
                }
                break;
            case EStepLogin.enterPassword:
                if (passwordInput.length === 0) {
                    console.log('PassWord is empty');
                    return;
                } else {
                    setPassword(passwordInput);
                    setCurrentStepLogin(isSignInMode ? EStepLogin.tryToCreateAccount : EStepLogin.tryToConnect)
                }
                break;

            case EStepLogin.signIn:
                setIsSignInMode(true);
                setCurrentStepLogin(EStepLogin.enterLogin);
                break;

            case EStepLogin.logIn:
                setIsSignInMode(false);
                setCurrentStepLogin(EStepLogin.enterLogin);
                break;

            case EStepLogin.tryLoginAsInvite:
        }
    }

    let defaultClassName: string;
    if (!className || className.trim().length === 0) {
        defaultClassName = 'flex flex-col items-center p-5 font-semibold text-xl space-y-10 pt-[25vh]';
    } else
        defaultClassName = className;

        async function goto42auth(){
            const generateOAuthURI = async (): Promise<string> => {
							const req = await apiReq.postApi.postTryGetIntraURL();
							return req.data;
            };
            console.log(await generateOAuthURI()); // Affiche l'URI générée
            router.push(await generateOAuthURI())
        }

    return (
        <div className={defaultClassName}>
            <NotificationContainer/>
            {welcomeTitle()}
            {currentStepLogin === EStepLogin.start &&
                <button onClick={() => goto42auth()} className='button-login h-14'>LOGIN
                    42</button>}
            {currentStepLogin < EStepLogin.tryLoginAsInvite &&
                <button onClick={() => nextStepCheck()} className='button-login'><span>{inviteButtonText}</span>
                </button>}
            {currentStepLogin === EStepLogin.signOrLogIn && askForLogOrSignIn()}
            {currentStepLogin === EStepLogin.enterLogin && enterLogin()}
            {(currentStepLogin === EStepLogin.signIn || currentStepLogin === EStepLogin.logIn) && enterLogin()}

            {currentStepLogin === EStepLogin.signOrLogIn /*&&
                <ClipLoader.BeatLoader className='pt-[12vh]' color="#36d7b7" size={13}/>*/
            }
            {currentStepLogin === EStepLogin.check2FA && enterCode2FA()}
            {currentStepLogin === EStepLogin.successLogin && LoggedSuccess()}
            {currentStepLogin === EStepLogin.failLogin && LoggedFailed(42)}

        </div>

    )
}