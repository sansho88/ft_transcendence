import Profile from "@/components/ProfileComponent";
import Button from "@/components/CustomButtonComponent";
import UserList from "@/components/UserListComponent";
import Game from "@/components/game/Game";
import React, {useContext, useEffect, useRef, useState} from "react";
import {LoggedContext, UserContext} from "@/context/globalContext";
import {authManager} from "@/components/api/ApiReq";
import {useRouter} from "next/navigation";
import {getUserMe} from "@/app/auth/Auth";
import NotifComponent from "@/components/notif/NotificationComponent";
import Button2FA from "@/components/2FA/2FAComponent";
import '@/components/chat/chat.css'
import ChatMaster from "./chat/ChatMaster";
import LoadingComponent from "@/components/waiting/LoadingComponent";
import MatchHistory from "@/components/MatchHistoryComponent";
import Leaderboard from "@/components/LeaderboardComponent";

const HomePage = () => {
    const {userContext, setUserContext} = useContext(UserContext);
    const {setLogged} = useContext(LoggedContext);
    const router = useRouter();
    const tokenRef = useRef<string>('');
    const [showMatchHistory, setMatchHistoryVisible] = useState(false);
    const [showLeaderboard, setLeaderboardVisible] = useState(false);


    useEffect(() => {
        //authManager.setBaseURL('http://' + window.location.href.split(':')[1].substring(2) + ':8000/api/');
        const token = localStorage.getItem("token");
        if (!token)
            router.push("/auth");
        else
            tokenRef.current = token;
        if (!userContext || userContext.UserID == -1)
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

    });

    return (
        <>
        { userContext ?
            <main className="main-background">

                    <Profile className={"main-user-profile"}
                             user={userContext}
                             isEditable={true} avatarSize={"big"} showStats={true}>
                        <Button image={"/history-list.svg"} onClick={() => {
                            setMatchHistoryVisible(!showMatchHistory);
                            setLeaderboardVisible(false);
                        }} alt={"Match History button"} title={"Match History"}/>
                        <Button image={"/podium.svg"} onClick={() => {
                            setLeaderboardVisible(!showLeaderboard);
                            setMatchHistoryVisible(false);
                        }} alt={"Leaderboard button"} title={"Leaderboard"} margin={"0 0 0 2ch"}/>
                        <Button2FA hasActive2FA={userContext.has_2fa}>2FA</Button2FA>
                    </Profile>

                {showMatchHistory && <MatchHistory/>}
                {showLeaderboard &&  <Leaderboard/>}

                <UserList className={"friends"} avatarSize={"medium"} showUserProps={true}/>
                <Button className={"logout"} image={"/logout.svg"} onClick={() => {
                    localStorage.clear();
                    router.push("/auth");
                    setLogged(false);
                    }
                } alt={"Logout button"}/>

                <div className={"game"}>
                    {tokenRef.current.length > 0 &&
                    <Game className={"game"} token={tokenRef.current}/>
                    }
                </div>
               <ChatMaster className={'chat_master'} token={tokenRef.current} userID={userContext.UserID}/>
                <div className={"absolute bottom-0 left-0"}><NotifComponent /></div>

            </main>
        : <LoadingComponent/>}
        </>
    )
}

export default HomePage;