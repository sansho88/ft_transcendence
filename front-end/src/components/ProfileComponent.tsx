import React, {useEffect, useState} from "react";
import Button from "./CustomButtonComponent"
import axios from "axios";


enum Colors {
    "grey",
    "green",
    "gold"
}

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




const Profile: React.FC<IUser> = ({children, className, nickname, avatar_path, login, status, isEditable})=>{

    const [modifiedNick, setNickText] = useState<string>(nickname);
    const [editMode, setEditMode] = useState(false);
    const [nickErrorMsg, setNickErrMsg] = useState("");
    const [userStatus, setUserStatus] = React.useState(EStatus.Online);


    let StatusColor = new Map<number, string>();

    for (let i: number = 0; i < 3; i++) {
        StatusColor.set(i, Colors[i]);
    }
    function handleUserStatus() { //todo: gestion dynamique avec le serveur et front

        setUserStatus(userStatus === EStatus.InGame ? EStatus.Online : EStatus.InGame);
        console.log(`User Status: ${userStatus}; statusColor ${StatusColor.get(userStatus)}`);
    }

    function getEnumNameByIndex(enumObj: any, index: number): string | undefined { //useful for userStatus
        const enumKeys = Object.keys(enumObj).filter((key) => typeof enumObj[key] === 'number');
        const enumValues = enumKeys.map((key) => enumObj[key]);

        if (enumValues.includes(index)) {
            return enumKeys[enumValues.indexOf(index)];
        }

        return undefined;
    }
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
                    const tmpNick = response.data.nickname;
                    setNickText(tmpNick);
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

   /* status={AllStatus[userStatus]} statusColor={StatusColor.get(userStatus)}*/
    return (
        <>
            <div className={className}>
                <img className={"avatar"} src={avatar_path} alt="Avatar" style={{
                    borderWidth: "2px",
                    borderColor: StatusColor.get(userStatus),
                    boxShadow: `1px 2px 5px ${StatusColor.get(userStatus)}`,
                    transition: "1000ms",
                    borderRadius: "8px",
                    width: "5vw",
                    height: "10vh"
                }}/>
                <div className={"infos"} style={{
                    fontFamily: "sans-serif",
                    color: "#07C3FF",
                    lineHeight: "1.5em"
                }
                }>
                    <h2 id={"login"}>{login}</h2>
                    {editedNick()}

                    <p id={"status"} style={{color:StatusColor.get(userStatus)}}>{getEnumNameByIndex(EStatus, status) }</p>
                </div>
                <div id={"children"} style={{marginLeft: "4px"}}>{children}</div>
            </div>
        </>);
};

export default Profile;