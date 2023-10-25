import React, {useContext, useEffect, useRef, useState} from "react";
import Button from "./CustomButtonComponent"
import Avatar from "@/components/AvatarComponent";
import * as apiReq from '@/components/api/ApiReq'
import "../utils/usefulFuncs"
import {Colors, getEnumNameByIndex} from "@/utils/usefulFuncs";
import {EStatus, IUser} from "@/shared/types";
import {getUserFromId} from "@/app/auth/Auth";
import {SelectedUserContext, SocketContextChat} from "@/context/globalContext";
import {NotificationManager} from 'react-notifications';
import Stats from "@/components/StatsComponent";

interface ProfileProps{
    user: IUser;
    avatarSize: string | undefined;
    showStats?: boolean;
    isMainProfile?: boolean;
    isOwner?: boolean;
}

const Profile: React.FC<ProfileProps> = ({children, className ,user, avatarSize, isEditable, showStats, isMainProfile, isOwner})=>{

    const [modifiedNick, setNickText] = useState<string>(user.nickname ? user.nickname : user.login);
    const [editMode, setEditMode] = useState(false);
    const {setSelectedUserContext} = useContext(SelectedUserContext);
    const [nickErrorMsg, setNickErrMsg] = useState("");
    const [statusColor, setStatusColor] = useState("grey");
    const [userStatus, setUserStatus] = useState(user.status);
    const socketChat      = useContext(SocketContextChat);
    const socketChatRef   = useRef(socketChat);
    const [isNicknameUsed, setIsNicknameUsed] = useState(false);

    useEffect(() => {
        setStatusColor(getEnumNameByIndex(Colors, user.status));
        return;
    }, [user.login]);

    socketChatRef.current?.on("userUpdate", (data: IUser) => {
        if (data.UserID == user.UserID)
        {
            setUserStatus(data.status);
            setStatusColor(getEnumNameByIndex(Colors, data.status));
        }
    });

    socketChatRef.current?.off("userUpdate", () => {});

    useEffect(() => {
        if (isNicknameUsed && modifiedNick !== user.nickname) {
          setNickErrMsg("Unavailable");
        }
      }, [isNicknameUsed, modifiedNick, user.nickname]);

    async function handleTextChange  (event: React.ChangeEvent<HTMLInputElement>)  { //updated for each character
        setIsNicknameUsed(false);

        const value = event.target.value;
        setNickText(value);
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
                    if (ret)
                    {
                        setIsNicknameUsed(true);
                        setNickErrMsg("Unavailable");
                    }
                    else
                    { setIsNicknameUsed(false);
                        setNickErrMsg("");

                    }

            })
                    .catch(() => console.error("Failed to check if nickname is used or not"));
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
                .catch(() => console.error(`Failed to get data from getUserFromId in Profile.`));



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
                    padding: "6px",
                }}/>
                <span style={{marginLeft: "4px", position: "fixed"}}><Button image={"/floppy.svg"} onClick={turnOffEditMode} alt={"Save Button"}/></span>
                <p style={{fontSize: "12px", color: "red"}}>{nickErrorMsg}</p>
            </div>);
        }
        else
            return (
                <p id={"nickname"} style={{textShadow: "1px 3px 8px #0888AFFF"}}>{modifiedNick}
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
            <div className={className} onClick={() => setSelectedUserContext(user)}>
                <Avatar path={user.avatar_path} width={`${WIDTH}vw`} height={`${HEIGHT}vh`} playerStatus={userStatus} isMainProfile={isMainProfile}/>
                <div className={"infos"} style={{
                    fontFamily: "sans-serif",
                    color: "#07C3FF",
                    lineHeight: "1.5em",
                    marginLeft: "10px",
                    display: "inline-block",
                    position: "relative",
                    transition:"1000ms",
                    top: "15px",
                }
            }>
                    <h2 id={"login"} style={{ color: "darkgrey", marginTop: "0", textShadow: "1px 1px 5px darkgrey"}}>{user.login}{isOwner ? " 👑":""}</h2>
                    {editedNick()}

                    <p id={"status"} style={{
                        color:statusColor,
                        transition:"0ms",
                        position: "relative", 
                        top: "0",
                        textShadow: `2px 2px 6px ${statusColor}`,
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
