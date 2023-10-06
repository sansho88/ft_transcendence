import Profile from "@/components/ProfileComponent";
import Stats from "@/components/StatsComponent";
import Button from "@/components/CustomButtonComponent";
import UserList from "@/components/UserListComponent";
import Game from "@/components/game/Game";
import React, {useContext, useEffect, useRef} from "react";
import {LoggedContext, SocketContextGame, UserContext} from "@/context/globalContext";
import {EStatus} from "@/shared/types";
import * as apiReq from "@/components/api/ApiReq";
import {useRouter} from "next/navigation";
import {getUserMe} from "@/app/auth/Auth";
import {authManager} from "@/components/api/ApiReq";
import NotifComponent from "@/components/notif/NotificationComponent";
import Button2FA from "@/components/2FA/2FAComponent";
import '@/components/chat/chat.css'
import ChatMaster from "./chat/ChatMaster";
import {wsGameRoutes} from "@/shared/routesApi";
import LoadingComponent from "@/components/waiting/LoadingComponent";

interface HomePageProps {
    className: unknown
}

const HomePage = ({className}: HomePageProps) => {
    const {userContext, setUserContext} = useContext(UserContext);
    const {setLogged} = useContext(LoggedContext);
    const router = useRouter();
    const tokenRef = useRef<string>('');
    const socket      = useContext(SocketContextGame);
    const socketRef   = useRef(socket);


    useEffect(() => {
        //authManager.setBaseURL('http://' + window.location.href.split(':')[1].substring(2) + ':8000/api/');
        const token = localStorage.getItem("token");
        if (!token)
            router.push("/auth");
        else
            tokenRef.current = token;
        if (!userContext)
        {
            let user;
            authManager.setToken(token);
            getUserMe(user).then((me) => setUserContext(me) )
                .catch(() => {
                    localStorage.clear();
                    router.push("/auth");
                });
        }
        localStorage.setItem('userContext', JSON.stringify(userContext));

    })


    socketRef.current?.on(wsGameRoutes.statusUpdate(), (newStatus: EStatus) => {
        let updateUser = userContext;
        if (updateUser && (newStatus != updateUser.status))
        {
            updateUser.status = newStatus;
            apiReq.putApi.putUser(updateUser)
                .catch((e) => {

                     console.error(e)
                })
            setUserContext(updateUser);
        }
    });
    /*
    socketRef.current?.on("connect", () =>{
        let updateUser = userContext;
        updateUser.status = EStatus.Online;

    })*/

    return (
        <>
        { userContext ?
            <main className="main-background">

                    <Profile className={"main-user-profile"}
                             nickname={userContext.nickname}
                             login={userContext.login} status={userContext.status }
                             avatar_path={userContext.avatar_path}
                             UserID={userContext.UserID }
                             isEditable={true} has_2fa={false}>

                        <Stats level={42} victories={112} defeats={24} rank={1}></Stats>
                        <Button image={"/history-list.svg"} onClick={() => console.log("history list button")} alt={"Match History button"}/>
                        <Button2FA hasActive2FA={userContext.has_2fa}>2FA</Button2FA>
                    </Profile>

                <UserList className={"friends"}/>
                <Button className={"logout"} image={"/logout.svg"} onClick={() => {
                    localStorage.clear();
                    router.push("/auth");
                    setLogged(false);
                    }
                } alt={"Logout button"}/>

                <div className={"game"}>
                    <Game className={"game"}/>
                </div>
               <ChatMaster className={'chat_master'} token={tokenRef.current}/>
                <div className={"absolute bottom-0 left-0"}><NotifComponent /></div>

            </main>
        : <LoadingComponent/>}
        </>
    )
}

export default HomePage;