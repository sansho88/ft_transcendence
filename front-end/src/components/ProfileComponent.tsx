import React, {useContext, useEffect, useState} from "react";
import Button from "./CustomButtonComponent"
import * as apiReq from '@/components/api/ApiReq'
import { UserContext } from "@/context/globalContext";
import * as POD from '@/shared/types'


interface MatchProps {
    opponent1: string;
    opponent2: string;
    scoreOpp1: bigint;
    scoreOpp2: bigint;
    date: string;
    id: bigint;
}
interface ProfileProps {
    avatar: string;
    login: string | undefined;
    nickname: string | undefined;
    status: string;
    statusColor?: string;
    isEditable: boolean;
}

const Profile: React.FC<ProfileProps> = ({children, className, avatar,login, nickname, status, statusColor, isEditable})=>{


		//undefined = temporaire/pas top, TODO: modifier la class IUSER et enlever les ?, faire des Partial<IUSER> quand besoin
    const [modifiedNick, setText] = useState<string | undefined>(nickname); // Initialisez avec une valeur initiale vide ou une valeur existante si nécessaire
    const [oldNick, setOldNick] = useState<string | undefined>(''); // Initialisez avec une valeur initiale vide ou une valeur existante si nécessaire
    const [editMode, setEditMode] = useState(false);
		const {userContext, setUserContext} = useContext(UserContext);
    const [errorMsg, setErrMsg] = useState("");


    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setText(event.target.value);

        if (value.length < 2 || value.length > 12 || !/^[A-Za-z0-9_]+$/.test(value)) {
            setErrMsg("Length: 2 => 12 & Alphanumerics only");
        } else {
            setErrMsg("");
        }
    };

		useEffect(() => {
			
			if(editMode === true)
				console.log('modifNick = ' + modifiedNick);
		}, [modifiedNick])


		useEffect(() => {
			async function postNick() {
				await apiReq.putApi.putUser({nickname: modifiedNick, id_user: userContext?.id_user}) //FIXME
				.then((res) => {
					if (res.status === 201)
						console.log('Nickname à été update en DB')						
				})
				.catch((e)=> {console.error(e)});
			}
			// let oldNick = modifiedNick;
			setOldNick(modifiedNick);
			console.log(`nick compare:|${oldNick}|${modifiedNick}|`)
			if(editMode === false)
			{
				if (oldNick !== modifiedNick)
				{
					postNick();
					setUserContext({
						...userContext as POD.IUser,
						nickname: modifiedNick,
					});
				}
			}

		}, [editMode])

    const turnOnEditMode = () => {
        setEditMode(true);
    }
    const turnOffEditMode = () => {
        if (!errorMsg.length)
            setEditMode(false);
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
                <p style={{fontSize: "12px", color: "red"}}>{errorMsg}</p>
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
                <img className={"avatar"} src={avatar} alt="Avatar" style={{
                    borderWidth: "2px",
                    borderColor: statusColor,
                    boxShadow: `1px 2px 5px ${statusColor}`,
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

                    <p id={"status"} style={{color:statusColor}}>{status}</p>
                </div>
                <p id={"children"} style={{marginLeft: "4px"}}>{children}</p>
            </div>
        </>);
};

export default Profile;