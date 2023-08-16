'use client';
import Image from 'next/image'
import React, {useContext, useEffect} from "react";
import Button from "../components/CustomButtonComponent"
import Profile from "../components/ProfileComponent"
import Stats from "../components/StatsComponent"

import {preloadFont} from "next/dist/server/app-render/rsc/preloads";
import {LoggedContext, UserContext} from '@/context/globalContext';
import {useRouter} from 'next/navigation';
import axios from "axios";
import * as POD from "@/shared/types";
import * as apiReq from '@/components/api/ApiReq'
import ChatRoomCommponent from '@/components/chat/ChatRoomComponent'
import {EStatus, IUser} from "@/shared/types";
import Game from "@/components/game/Game";
import {store} from "next/dist/build/output/store";

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
        let storedLogin = localStorage.getItem("login");
        console.log("Main Page: localStorageLogin? " + storedLogin);

        if(!logged && !localStorage.getItem("login"))
            router.push('/auth')
        else
        {
            try {
                  apiReq.getApi.getMe()
                    .then((req) => {
                        console.log("[Get User Me]",req.data.login);
                        const reqUser = req.data as IUser;
                        setUserLogin(reqUser.login)
                        setUserNickName(reqUser.nickname ? reqUser.nickname : "");
                    });

            } catch (error) {
                console.error("[Get User Me ERROR]",error);
            }
        }
    }, [logged])
 
   
    const [userLogin, setUserLogin] = React.useState( "lelogin");
    const [userNickName, setUserNickName] = React.useState( "Nick");
    const [userStatus, setUserStatus] = React.useState(EStatus.Online);

    function handleLogin() {
       // setLog(true);
        console.log("LOGGED REALLY!");
    }

   /* useEffect(() => {
        if (logged)
        {
            console.log("[mainPage: useEffect]User logged. Trying to get infos from database... ")
            apiReq.getApi.getUserByLogin(localStorage.getItem("login"))//fixme: login == undefined there
                .then((response) => {
                    console.log('response:' + response.login);
                    setUserLogin(response.login);
                    setUserNickName(response.nickname ? response.nickname : "");
                })
                .catch((e) => {
                    console.error('error:' + e.toString());
                });
        }
    }, [logged]);*/

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
                    <Profile className={"main-user-profile"} nickname={userNickName} login={userLogin} status={userContext.status} avatar_path={userContext.avatar_path} isEditable={true}>

                        <Stats level={42} victories={112} defeats={24} rank={1}></Stats>
                        <Button image={"/history-list.svg"} onClick={handleLogin} alt={"Match History button"}/>
                    </Profile>
                    <Button className={"friends"} image={"/friends.svg"} onClick={handleLogin} alt={"Friends list"}
                            height={"42px"}/>

                    {/*<div className={"game"} onClick={switchOnlineIngame}>

                        <Game

                         className={"game"}/>

                        <Button className={"game-options"} border={""} color={""} image={"/joystick.svg"}
                                alt={"GameMode options"} radius={"0"} onClick={switchOnlineIngame}/>
                    </div>*/}
                    <ChatRoomCommponent className={"chat"} />

                </main>
            </>
        )
}
