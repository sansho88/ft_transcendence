'use client';
import React, {useContext, useEffect} from "react";
import Button from "../components/CustomButtonComponent"
import Profile from "../components/ProfileComponent"
import Stats from "../components/StatsComponent"
import UserList from "@/components/UserListComponent";

import {preloadFont} from "next/dist/server/app-render/rsc/preloads";
import {LoggedContext, TokenContext, UserContext} from '@/context/globalContext';
import {useRouter} from 'next/navigation';
import * as POD from "@/shared/types";
import {EStatus} from "@/shared/types";
import * as apiReq from '@/components/api/ApiReq'
import ChatRoomCommponent from '@/components/chat/ChatRoomComponent'
import Game from "@/components/game/Game";


export default function Home() {
    preloadFont("../../_next/static/media/2aaf0723e720e8b9-s.p.woff2", "font/woff2");
    const {logged, setLogged} = useContext(LoggedContext);
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

    async function updateStatusUser(id_user, status) { //to remove when the player status will be updated directly from the Back
        const updateUser: Partial<POD.IUser> = {UserID: id_user,
            login: userContext.login,
            visit: userContext.visit,
            status: status,
            nickname: userContext.nickname,
            avatar_path: userContext.avatar_path,
            has_2fa: userContext.has_2fa,
            token_2fa: userContext.token_2fa}
        await apiReq.putApi.putUser(updateUser)
            .then(() => {
                setUserContext(updateUser);
            })
            .catch((e) => {
                console.error(e)
            })
    }

    function switchOnlineIngame() {
        const tmpStatus = userContext?.status == EStatus.Online ? EStatus.InGame : EStatus.Online;
        //userContext.status = tmpStatus;

        //setUserContext(userContext);
        updateStatusUser(userContext?.UserID, tmpStatus)
            .catch((e) => console.error(e));

        console.log('[MAIN PAGE]USER STATUS:' + userContext.status);
    }


    useEffect(() => {
        console.log("Main Page: isLogged? " + logged);
        let storedLogin = localStorage.getItem("login");
        console.log("Main Page: localStorageLogin? " + storedLogin);

        if (!logged /*&& !localStorage.getItem("login")*/)
            router.push('/auth')
        else {
            console.log("User is already LOGGED as " + localStorage.getItem("login"))
            setUserLogin(userContext.login ? userContext.login : "");
            setUserNickName(userContext.nickname ? userContext.nickname : "");

        }
    }, [logged])


    const [userLogin, setUserLogin] = React.useState("lelogin");
    const [userNickName, setUserNickName] = React.useState("Nick");

    function handleLogin() {
        // setLog(true);
        console.log("LOGGED REALLY!");
    }


    if (!logged /*&& !localStorage.getItem("login")*/)
        router.push('/auth')
    else
        return (
            <>
                <main className="main-background">
                    <Profile className={"main-user-profile"}
                             nickname={userContext.nickname ? userContext.nickname : "BADNICKNAME"}
                             login={userContext.login ? userContext.login : "BADLOGIN"} status={userContext.status ? userContext.status : 0}
                             avatar_path={userContext.avatar_path} isEditable={true}>

                        <Stats level={42} victories={112} defeats={24} rank={1}></Stats>
                        <Button image={"/history-list.svg"} onClick={handleLogin} alt={"Match History button"}/>
                    </Profile>
                    <Button className={"friends"} image={"/friends.svg"} onClick={handleLogin} alt={"Friends list"}
                            height={"42px"}/>
                    <UserList />

                    <div className={"game"} onClick={switchOnlineIngame}>

                        <Game className={"game"}/>

                        <Button className={"game-options"} border={""} color={""} image={"/joystick.svg"}
                                alt={"GameMode options"} radius={"0"} onClick={switchOnlineIngame}/>
                    </div>
                    <ChatRoomCommponent className={"chat"}/>

                </main>
            </>
        )
}
