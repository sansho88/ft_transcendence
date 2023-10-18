import React, {useContext, useEffect, useRef, useState} from "react";
import Button from "./CustomButtonComponent"
import Avatar from "@/components/AvatarComponent";
import * as apiReq from '@/components/api/ApiReq'


import "../utils/usefulFuncs"
import {Colors, getEnumNameByIndex} from "@/utils/usefulFuncs";
import {EStatus, IUser} from "@/shared/types";
import {getUserFromId} from "@/app/auth/Auth";
import {SocketContextChat, SocketContextGame} from "@/context/globalContext";
import {NotificationManager} from 'react-notifications';
import {IGameSessionInfo} from "@/shared/typesGame";
import Stats from "@/components/StatsComponent";

interface ProfileProps{
    user: IUser;
    avatarSize: string | undefined;
    showStats?: boolean;
}
const Profile: React.FC<ProfileProps> = ({children, className ,user, avatarSize, isEditable, showStats})=>{

    const [modifiedNick, setNickText] = useState<string>(user.nickname ? user.nickname : user.login);
    const [editMode, setEditMode] = useState(false);
    const [nickErrorMsg, setNickErrMsg] = useState("");
    const [statusColor, setStatusColor] = useState("grey");
    const [userStatus, setUserStatus] = useState(user.status);
    const socketGame      = useContext(SocketContextGame);
    const socketGameRef   = useRef(socketGame);
    const socketChat      = useContext(SocketContextChat);
    const socketChatRef   = useRef(socketChat);
    const [isNicknameUsed, setIsNicknameUsed] = useState(false);
    const [userRefreshed, setUserRefreshed] = useState(user);

    useEffect(() => {
        if (socketChatRef.current?.disconnected)
        {
            socketChatRef.current?.connect();
        }

        console.log(socketChatRef.current?.disconnected);
    }, [user.login]);

    useEffect(() => {
        const timer = setInterval(() => {
            getUserFromId(user.UserID).then((res) => {
                setUserRefreshed(res);
                setUserStatus(res.status);
                setStatusColor(getEnumNameByIndex(Colors, res.status));
            })
                .catch((error) =>
                console.log("[Profile] trying to receive refreshed user data"));

        }, 4000);

        return () => {
            clearInterval(timer);
        };
    })


    useEffect(() => {
        setStatusColor(getEnumNameByIndex(Colors, user.status));
        console.log("[PROFILE] STATUS UPDATED: " + userStatus);
    }, [userStatus]);

    socketGameRef.current?.on("infoGameSession", (data: IGameSessionInfo) => {
        if ((data.player1 && data.player1.login == user.login) || data.player2.login == user.login)
        {
           /* setUserStatus(EStatus.InGame);
            setStatusColor(getEnumNameByIndex(Colors, user.status));*/
            let tmpUser = userRefreshed;
            tmpUser.status = EStatus.InGame;
            apiReq.putApi.putUser(tmpUser);

            socketGameRef.current?.on("endgame", () => {
                    /*setUserStatus(EStatus.Online);
                    setStatusColor(getEnumNameByIndex(Colors, userStatus));*/
                tmpUser.status = EStatus.Online;
                apiReq.putApi.putUser(tmpUser);
            });
        }

    });

    useEffect(() => {
        if (isNicknameUsed && modifiedNick !== user.nickname) {
          setNickErrMsg("Unavailable");
        }
      }, [isNicknameUsed, modifiedNick, user.nickname]);

    async function handleTextChange  (event: React.ChangeEvent<HTMLInputElement>)  { //updated for each character
        setIsNicknameUsed(false);

        const value = event.target.value;
        setNickText(value);
        // socketChatRef.current?.emit("NicknameUsed", {nickname:value});
        if (value.length < 2 || value.length > 12) {
            setNickErrMsg("Length: 2 => 12");
        }
        else if (!/^[A-Za-z0-9_]+$/.test(value)) {
            setNickErrMsg("Alphanumerics only");
        }
        else {
            console.log(`value= ${value}, nickname=${user.nickname} `)
            if (value != user.nickname)
                await apiReq.getApi.getIsNicknameUsed(value).then((res) => {
                    const ret: boolean = res.data;
                    if (ret == true)
                    {
                        setIsNicknameUsed(true);
                        setNickErrMsg("Unavailable");
                    }
                    else
                    { setIsNicknameUsed(false);
                        setNickErrMsg("");

                    }

            })
                    .catch((error) => console.error("Failed to check if nickname is used or not"));
        }
    }

    const turnOnEditMode = () => {
        setEditMode(true);
    }
    const turnOffEditMode = async () => {

        if (!nickErrorMsg.length) {

            await getUserFromId(user.UserID).then( (userGet) => {
            userGet.nickname = modifiedNick;
            apiReq.putApi.putUser(userGet)
                .then(() => {
                    setEditMode(false);
                })
                .catch((error) => {
                    NotificationManager.error(error.data, "Edit of nickname failed");
                })
            ;
            })
                .catch((error) => console.error(`Failed to get data from getUserFromId in Profile.`));



        }
    }

    const editedNick = () => {
        if(editMode) {
            return (<div>
                <input type="text" minLength={2} maxLength={12} pattern={"[A-Za-z0-9_]+"} value={modifiedNick} onChange={handleTextChange}

                style={{
                    width: "8em",
                    border: "2px ridge darkgrey",
                    borderRadius: "4px",
                    background: "none",
                    padding: "6px"
                }}/>
                <span style={{marginLeft: "4px", position: "fixed"}}><Button image={"/floppy.svg"} onClick={turnOffEditMode} alt={"Save Button"}/></span>
                <p style={{fontSize: "12px", color: "red"}}>{nickErrorMsg}</p>
            </div>);
        }
        else
            return (
                <p id={"nickname"}>{modifiedNick}
                    {isEditable ?
                        <span id={"editNickNameButton"} style={{marginLeft: "4px"}}>
                            <Button image={"/edit.svg"} onClick={turnOnEditMode} alt={"edit NickName button"}/>
                        </span>
                        : <></>
                    }
                </p>

            )
    }


    let WIDTH= 4;


    if (avatarSize){
        switch (avatarSize) {

            case "small": WIDTH= 1; break;
            case "medium": WIDTH= 2; break;
            case "big": WIDTH = 4; break;

        }
    }
   let HEIGHT= WIDTH * 2.5

    return (
        <>
            <div className={className}>
                <Avatar path={user.avatar_path} width={`${WIDTH}vw`} height={`${HEIGHT}vh`} playerStatus={userStatus}/>
                <div className={"infos"} style={{
                    fontFamily: "sans-serif",
                    color: "#07C3FF",
                    lineHeight: "1.5em",
                    marginLeft: "10px",
                    display: "inline-block",
                    position: "relative",
                    transition:"1000ms",
                    top: "15px"
                }
            }>
                    <h2 id={"login"} style={{ color: "darkgrey", marginTop: "0"}}>{user.login}</h2>
                    {editedNick()}

                    <p id={"status"} style={{
                        color:statusColor,
                        transition:"0ms",
                        position: "relative", 
                        top: "0",
                        }}>
                        {getEnumNameByIndex(EStatus, userStatus)}
                    </p>
                </div>
                <div id={"children"} style={{marginLeft: "4px", marginTop: "6px", clear: "both"}}>
                    {showStats && <Stats user={user}/>}
                    {children}
                </div>
            </div>
        </>);
};

export default Profile;