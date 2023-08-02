'use client';
import Image from 'next/image'
import React, {useContext, useEffect} from "react";
import Button from "../components/CustomButtonComponent"
import Profile, {EStatus} from "../components/ProfileComponent"
import Stats from "../components/StatsComponent"

import {preloadFont} from "next/dist/server/app-render/rsc/preloads";
import {LoggedContext, UserContext} from '@/context/globalContext';
import {useRouter} from 'next/navigation';
import axios from "axios";
import * as POD from "@/shared/types";
import * as apiReq from '@/components/api/ApiReq'
import ChatRoomCommponent from '@/components/chat/ChatRoomComponent'

export default function Home() {
	preloadFont("../../_next/static/media/2aaf0723e720e8b9-s.p.woff2", "font/woff2");
	const { logged, setLogged } = useContext(LoggedContext);
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

    async function updateStatusUser(id_user, status) {
        const updateUser: Partial<POD.IUser> = {id_user: id_user, status: status}
        await apiReq.putApi.putUser(updateUser)
            .then(() => {
                setUserContext(updateUser);
            })
            .catch((e) => {console.error(e)})
    }

    function switchOnlineIngame(){
        const tmpStatus = userContext?.status == EStatus.Online ? EStatus.InGame : EStatus.Online;
        userContext.status = tmpStatus;

        setUserContext(userContext);
        updateStatusUser(userContext?.id_user, tmpStatus)
            .catch((e) => console.error(e));

        console.log('[MAIN PAGE]USER STATUS:' + userContext.status);
    }

    useEffect(() => {
        console.log("Main Page: isLogged? " + logged);
        console.log("Main Page: localStorageLogin? " + localStorage.getItem("login"));
        if(!logged && !localStorage.getItem("login"))
            router.push('/auth')
        else
        {
            console.log("ID USER: " + userContext?.id_user);
        }
    }, [logged])
 
   
    const [userLogin, setUserLogin] = React.useState( "lelogin");
    const [userNickName, setUserNickName] = React.useState( "Nick");
    const [userStatus, setUserStatus] = React.useState(EStatus.Online);

    function handleLogin() {
       // setLog(true);
        console.log("LOGGED REALLY!");
    }

    useEffect(() => {
        if (logged)
            axios.get(`http://localhost:8000/api/users/${userContext?.id_user}`)
                .then((response) => {
                    console.log('response:' + response.data.nickname);
                    setUserLogin(response.data.login);
                    setUserNickName(response.data.nickname);
                })
                .catch((e) => {
                    console.error('error:' + e.toString());
                });
    }, [logged]);

    function login() {
        if (!logged)
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


    if(!logged /*&& !localStorage.getItem("login")*/)
        router.push('/auth')
    else
        return (
            <>
                <main className="main-background">
                    <Profile className={"main-user-profile"} user_id={userContext.id_user} nickname={userNickName} login={userLogin} status={1} avatar_path={"/tests/avatar.jpg"} isEditable={true}>

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
                            onClick={switchOnlineIngame}
                        />
                        <ChatRoomCommponent className='' classNameBlockMessage='m-6 overflow-auto h-[350px]'/>
                        <Button className={"game-options"} border={""} color={""} image={"/joystick.svg"}
                                alt={"GameMode options"} radius={"0"} onClick={switchOnlineIngame}/>
                    </div>


                </main>
            </>
        )
}
