import Profile from "@/components/ProfileComponent";
import Stats from "@/components/StatsComponent";
import Button from "@/components/CustomButtonComponent";
import UserList from "@/components/UserListComponent";
import Game from "@/components/game/Game";
import ChatRoomCommponent from "@/components/chat/ChatRoomComponent";
import React, {useContext, useEffect} from "react";
import {LoggedContext, UserContext} from "@/context/globalContext";
import {EStatus, IUser} from "@/shared/types";
import * as apiReq from "@/components/api/ApiReq";
import {useRouter} from "next/navigation";
import {getUserMe} from "@/app/auth/Auth";
import {authManager} from "@/components/api/ApiReq";

const HomePage = () => {
    const {userContext, setUserContext} = useContext(UserContext);
    const {logged, setLogged} = useContext(LoggedContext);
    const router = useRouter();


    useEffect(() => {
        authManager.setBaseURL('http://' + window.location.href.split(':')[1].substring(2) + ':8000/api/');
        localStorage.setItem('userContext', JSON.stringify(userContext));
        if (!userContext)
        {
            authManager.setToken(localStorage.getItem("token"));
            getUserMe().then((me) => setUserContext(me) );
        }
    })

    enum Colors {
        "grey",
        "green",
        "gold"
    }
    async function updateStatusUser(id_user, status) { //to remove when the player status will be updated directly from the Back

        let updateUser: Partial<IUser> = userContext;
        updateUser.status = status;

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

        updateStatusUser(userContext?.UserID, tmpStatus)
            .catch((e) => console.error(e));

        console.log('[MAIN PAGE]USER STATUS:' + tmpStatus);
    }

    return (
        <>
            <main className="main-background">
                { userContext &&
                    <Profile className={"main-user-profile"}
                             nickname={userContext.nickname}
                             login={userContext.login} status={userContext.status }
                             avatar_path={userContext.avatar_path}
                             UserID={userContext.UserID }
                             isEditable={true} has_2fa={false}>

                        <Stats level={42} victories={112} defeats={24} rank={1}></Stats>
                        <Button image={"/history-list.svg"} onClick={() => console.log("history list button")} alt={"Match History button"}/>
                    </Profile>
                }
                <UserList className={"friends"}/>
                <Button className={"logout"} image={"/logout.svg"} onClick={() => {
                    localStorage.clear();
                    router.push("/auth");
                    setLogged(false);
                    }
                } alt={"Logout button"}/>

                <div className={"game"} onClick={switchOnlineIngame}>
                    <Game className={"game"}/>
                </div>
               {/* <ChatRoomCommponent className={"chat"}/> fixme Fait crash la page ?*/ }

            </main>
        </>
    )
}

export default HomePage;