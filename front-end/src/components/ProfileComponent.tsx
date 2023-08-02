import React, {useContext, useEffect, useState} from "react";
import Button from "./CustomButtonComponent"
import Avatar from "@/components/AvatarComponent";
import axios from "axios";
import {LoggedContext, UserContext} from '@/context/globalContext';
import {getApi} from "@/components/api/ApiReq";
import getUserById = getApi.getUserById;
import {id} from "postcss-selector-parser";
import "../utils/usefulFuncs"
import {Colors, getEnumNameByIndex} from "@/utils/usefulFuncs";
import * as apiReq from '@/components/api/ApiReq'

interface MatchProps {
    opponent1: string;
    opponent2: string;
    scoreOpp1: bigint;
    scoreOpp2: bigint;
    date: string;
    id: bigint;
}

export enum EStatus {
    Offline,
    Online,
    InGame
}

export interface IUser {
    Id_USERS?: number;
    login: string;
    nickname: string;
    avatar_path: string;
    status: number;
    token_2FA: string;
    has_2FA: boolean;

}




const Profile: React.FC<IUser> = ({children, className, user_id ,nickname, avatar_path, login, status, isEditable})=>{

    const [modifiedNick, setNickText] = useState<string>(nickname);
    const [editMode, setEditMode] = useState(false);
    const [nickErrorMsg, setNickErrMsg] = useState("");
    const {userContext, setUserContext} = useContext(UserContext);
    const [statusColor, setStatusColor] = useState("grey");

    const [ user, setUser] = useState<Partial<IUser>>({nickname: "", login:"", status:0, avatar_path:"", Id_USERS:0});

  /* async function getUserData(id_user){
            await axios.get(`http://localhost:8000/api/users/${id_user}`)
               .then((userData) =>{
               setUser(userData);
               console.log("[GetUserData]" + userData.login)
           })
               .catch((e) => {console.error("[Profile Component]getUserData:" + e)})
   }

   if (user.login === undefined) {
       getUserData(user_id)
           .then(() => {
               if (user.login) {
                   login = user.login;
                   console.log("YAYYYYYIhdifjvprjvf op");
               }
           })
           .catch((e) => console.error(e));

   }

*/



    useEffect(() => {
        setStatusColor(getEnumNameByIndex(Colors, userContext.status ? userContext.status : 0));
    }, [userContext.status]);


    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => { //updated for each character

            const value = event.target.value;
            setNickText(event.target.value);

        if (value.length < 2 || value.length > 12 || !/^[A-Za-z0-9_]+$/.test(value)) {
            setNickErrMsg("Length: 2 => 12 & Alphanumerics only");
        } else {
            setNickErrMsg("");
        }
    };

    useEffect(() => {
        if (modifiedNick != nickname && !editMode)
            axios.get(`http://localhost:8000/api/users/login/${login}`)
                .then((response) => {
                    setNickText(response.data.nickname);
                })
                .catch((e) => {
                    console.error('error:' + e.toString());
                });
    });

    const turnOnEditMode = () => {
        setEditMode(true);
    }
    const turnOffEditMode = () => {

        if (!nickErrorMsg.length)
        {
            axios.get(`http://localhost:8000/api/users/login/${login}`). //temporaire en attendant d'avoir un put par login
            then((user) => {
                axios.put(`http://localhost:8000/api/users/${user.data.id_user}`, {nickname: modifiedNick})
                    .then((response) => {
                        console.log(response.data);
                        setEditMode(false);
                    })
                    .catch((error) => {
                        console.error(error);
                    })
            })

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

    return (
        <>
            <div className={className}>
                <Avatar avatar_path={""} />
                <div className={"infos"} style={{
                    fontFamily: "sans-serif",
                    color: "#07C3FF",
                    lineHeight: "1.5em"
                }
                }>
                    <h2 id={"login"}>{login}</h2>
                    {editedNick()}

                    <p id={"status"} style={{
                        color:statusColor,
                        transition:"1000ms"}}>
                        {getEnumNameByIndex(EStatus, userContext.status ? userContext.status : 0) }
                    </p>
                </div>
                <div id={"children"} style={{marginLeft: "4px"}}>{children}</div>
            </div>
        </>);
};

export default Profile;