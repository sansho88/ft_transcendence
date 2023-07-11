import React, {useState} from "react";
import Button from "./CustomButtonComponent"


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
    login: string;
    nickname: string;
    status: string;
    statusColor?: string;
    isEditable: boolean;
}

const Profile: React.FC<ProfileProps> = ({children, className, avatar,login, nickname, status, statusColor, isEditable})=>{


    const [modifiedNick, setText] = useState<string>(nickname); // Initialisez avec une valeur initiale vide ou une valeur existante si nécessaire
    const [editMode, setEditMode] = useState(false);
    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    const turnOnEditMode = () => {
        setEditMode(true);
    }
    const turnOffEditMode = () => {
        setEditMode(false);
    }

    const editedNick = () => {
        if(editMode) {
            return (<div>
                <input type="text" value={modifiedNick} onChange={handleTextChange}
                style={{
                    width: "8em",
                    border: "2px ridge darkgrey",
                    borderRadius: "4px",
                    background: "none",
                    padding: "6px"
                }}/>
                <span style={{marginLeft: "4px"}}><Button image={"/floppy.svg"} onClick={turnOffEditMode} alt={"Save Button"}/></span>
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