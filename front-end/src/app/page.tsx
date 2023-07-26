'use client';
import Image from 'next/image'
import React,{useContext, useEffect} from "react";
import Button from "../components/CustomButtonComponent"
import Profile, {EStatus} from "../components/ProfileComponent"
import Stats from "../components/StatsComponent"

import { preloadFont } from "next/dist/server/app-render/rsc/preloads";
import * as POD from '@/shared/types'
import { UserContext, LoggedContext } from '@/context/globalContext';
import { useRouter } from 'next/navigation';

export default function Home() {
	preloadFont("../../_next/static/media/2aaf0723e720e8b9-s.p.woff2", "font/woff2");
	const { isLogged, setIsLogged } = useContext(LoggedContext);
	const {userContext, setUserContext} = useContext(UserContext);
	const router = useRouter();
	
    enum Colors {
        "grey",  
        "green",
        "gold"
    }
    let StatusColor = new Map<number, string>();

    for (let i: number = 0; i < 3; i++) {
        StatusColor.set(i, Colors[i]);
    }


		useEffect(() => {
			if(!isLogged)
				router.push('/auth')
		}, [isLogged])
 
   
    const [userLogin, setUserLogin] = React.useState( "lelogin");
    const [userNickName, setUserNickName] = React.useState( "Nick");
    const [userStatus, setUserStatus] = React.useState(EStatus.Online);

    function handleLogin() {
        setLog(true);
        console.log("LOGGED REALLY!");
    }

    useEffect(() => {
        if (isLogged)
            axios.get("http://localhost:8000/api/users/2")
                .then((response) => {
                    console.log('response:' + response.data.nickname);
                    setUserLogin(response.data.login);
                    setUserNickName(response.data.nickname);
                })
                .catch((e) => {
                    console.error('error:' + e.toString());
                });
    });

    function login() {
        if (!isLogged)
            return (
                <button type="button" onClick={handleLogin} className={"button-login"}>

                    <span className="text">LOGIN</span></button>
            )
        else
            return hello("Sansho");

    }

    function hello(name: string) {

        let msg: string = "";

        if (name.length)
            msg = "dear " + name + " !\n";
        return (
            <div>
                Hello {msg}
            </div>
        )
    }


    if (!isLogged)
        return (
            <>
                <div className="main-background">
                    <div className="welcome">
                        <div className="welcome-msg">WELCOME TO</div>
                        {/*<div className="width: 788px; height: 130px; left: 0px; top: 24px; position: absolute; justify-content: center; align-items: center; display: inline-flex">*/}
                        <div className="welcome-title">PONG POD! {login()}</div>

                    </div>
                </div>
            </>
        )
    else
        return (
            <>
                <main className="main-background">
                    <Profile className={"main-user-profile"} nickname={userNickName} login={userLogin} Id_USERS={2} status={1} avatar_path={"/tests/avatar.jpg"} isEditable={true}>

                        <Stats level={42} victories={112} defeats={24} rank={1}></Stats>
                        <Button image={"/history-list.svg"} onClick={handleLogin} alt={"Match History button"}/>
                    </Profile>
                    <Button className={"friends"} image={"/friends.svg"} onClick={handleLogin} alt={"Friends list"}
                            height={"42px"}/>

                    <div className="game">

                        <Image
                            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] max-w-fit max-h-fit"
                            src="/pong-logo.png"
                            alt="Pong Logo"
                            width={768}
                            height={768}
                            priority
                            onClick={handleLogin}
                        />
                        <Button className={"game-options"} border={""} color={""} image={"/joystick.svg"}
                                alt={"GameMode options"} radius={"0"} onClick={handleLogin}/>
                    </div>


                </main>
            </>
        )
}
