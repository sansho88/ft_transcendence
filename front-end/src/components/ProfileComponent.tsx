import React, {useContext, useEffect, useRef, useState} from "react";
import Button from "./CustomButtonComponent"
import Avatar from "@/components/AvatarComponent";
import * as apiReq from '@/components/api/ApiReq'
import "../utils/usefulFuncs"
import {Colors, getEnumNameByIndex} from "@/utils/usefulFuncs";
import {EStatus, IUser} from "@/shared/types";
import {getUserFromId} from "@/app/auth/Auth";
import {SocketContextChat, SocketContextGame} from "@/context/globalContext";
import {IGameSessionInfo} from "@/shared/typesGame";


const Profile: React.FC<IUser> = ({children, className ,nickname, avatar_path, login, status, UserID, isEditable})=>{

    const [modifiedNick, setNickText] = useState<string>(nickname ? nickname : login);
    const [editMode, setEditMode] = useState(false);
    const [nickErrorMsg, setNickErrMsg] = useState("");
    const [statusColor, setStatusColor] = useState("grey");
    const [userStatus, setUserStatus] = useState(status);
    const socketGame      = useContext(SocketContextGame);
    const socketGameRef   = useRef(socketGame);
    const socketChat      = useContext(SocketContextChat);
    const socketChatRef   = useRef(socketChat);
    const [isNicknameUsed, setIsNicknameUsed] = useState(false);


    useEffect(() => {
        if (socketChatRef.current?.disconnected)
        {
            socketChatRef.current?.connect();
        }


    }, [login]);



   /* if (userStatus == undefined)
       setUserStatus(EStatus.Offline);*/

    useEffect(() => {
        setStatusColor(getEnumNameByIndex(Colors, userStatus ? userStatus : 0));
        console.log("[PROFILE] STATUS UPDATED: " + userStatus);
    }, [userStatus]);


    /*socketGameRef.current?.on(wsGameRoutes.statusUpdate(), (newStatus: EStatus) => {
        console.log('new status = ' + newStatus);
       setUserStatus(newStatus);
        setStatusColor(getEnumNameByIndex(Colors, userStatus));
    });*/

    socketGameRef.current?.on("connect", () => {
        setUserStatus(EStatus.Online);
    })

    socketGameRef.current?.on("infoGameSession", (data: IGameSessionInfo) => {
        if ((data.player1 && data.player1.login == login) || data.player2.login == login)
        {
            setUserStatus(EStatus.InGame);
            setStatusColor(getEnumNameByIndex(Colors, userStatus));

            socketGameRef.current?.on("endgame", () => {
                    setUserStatus(EStatus.Online);
                    setStatusColor(getEnumNameByIndex(Colors, userStatus));
            });
        }

    });

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => { //updated for each character

        let typingTimer;
        const value = event.target.value;
        setNickText(value);
        clearTimeout(typingTimer);

        typingTimer = setTimeout(() => {
            socketChatRef.current?.emit("NicknameUsed", {nickname: value});
            console.log(`isNicknameUsed= ${isNicknameUsed}`);
        }, 300);

        if (value.length < 2 || value.length > 12) {
            setNickErrMsg("Length: 2 => 12");
        }
        else if (!/^[A-Za-z0-9_]+$/.test(value))
        {
            setNickErrMsg("Alphanumerics only");
        }
        else if ((isNicknameUsed && modifiedNick != nickname))
        {
            setNickErrMsg("Unavailable");
            console.log("Abanon");
        }
        else {
            setNickErrMsg("");
        }
    };


    useEffect(() => {



        socketChatRef.current?.on("NicknameUsed", (res) => {
            setIsNicknameUsed(res);
            console.log("res: " + res);


        });
        return (() => {
            socketChatRef.current?.off("NicknameUsed");
        });
    }, []);

    const turnOnEditMode = () => {
        setEditMode(true);
    }
    const turnOffEditMode = async () => {
        if ((isNicknameUsed && modifiedNick != nickname))
        {
            setNickErrMsg("Unavailable");
        }

        if (!nickErrorMsg.length) {

            await getUserFromId(UserID).then( (userGet) => {
            console.log("[PROFILE] login to update: " + userGet.login);
            userGet.nickname = modifiedNick;
            apiReq.putApi.putUser(userGet);
            });
            setEditMode(false);

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
                <span style={{marginLeft: "4px"}}><Button image={"/floppy.svg"} onClick={turnOffEditMode} alt={"Save Button"}/></span>
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


    const WIDTH= 4, HEIGHT= WIDTH * 2.5
    return (
        <>
            <div className={className}>
                <Avatar path={avatar_path} width={`${WIDTH}vw`} height={`${HEIGHT}vh`} playerStatus={userStatus}/>
                <div className={"infos"} style={{
                    fontFamily: "sans-serif",
                    color: "#07C3FF",
                    lineHeight: "1.5em",
                    display: "inline-block",
                    position: "relative",
                    marginLeft: "10px",
                    paddingTop: "2%",
                    top: "2vh"

                }
                }>
                    <h2 id={"login"} style={{ color: "darkgrey"}}>{login}</h2>
                    {editedNick()}

                    <p id={"status"} style={{
                        color:statusColor,
                        transition:"1000ms"}}>
                        {getEnumNameByIndex(EStatus, userStatus)}
                    </p>
                </div>
                <div id={"children"} style={{marginLeft: "4px"}}>{children}</div>
            </div>
        </>);
};

export default Profile;