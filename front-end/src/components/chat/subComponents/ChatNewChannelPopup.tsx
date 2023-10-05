import {input} from "zod";
import React, {useState} from "react";
import Image from "next/image";

const ChatNewChannelPopup = ({className}) => {
    const [channelName, setChannelName] = useState("");
    const [channelPassword, setChannelPassword] = useState("");
    const [channelType, setChannelType] = useState("");
    const [areSettingsValids, setSettingsValid] = useState(false);

    const handleOnChange = (event) => {
        setChannelType( event.target.value);
        setChannelPassword("");
        if (channelType.length > 0 && channelType != "Protected" && channelName.length > 2)
        {
            setSettingsValid(true);
            console.log("case A");
        }
        else if (channelType != "Protected")
        {
            setChannelPassword("");
            console.log("case B");
        }
        else if (channelType == "Protected" && channelPassword.length < 3)
        {
            setSettingsValid(false);
            console.log("case C");
        }
        console.log(`channel type: ${channelType}`);
       /* else
        {
            setSettingsValid(false);
            console.log("case D");
        }*/
    };

    function handleOnNameChange(event: React.ChangeEvent<HTMLInputElement>){
        const value = event.target.value;
        setChannelName(value);
        if (value.length > 2 && channelType != "Protected")
        {
            setSettingsValid(true);
            console.log("case E");
        }
        else if (channelType == "Protected" && channelPassword.length < 3)
        {
            setSettingsValid(false);
            console.log("case F");
        }
        else
        {
            setSettingsValid(false);
            console.log("case G");
        }

    }
    function handleOnPasswordChange(event: React.ChangeEvent<HTMLInputElement>){
            const value = event.target.value;
            setChannelPassword(value);
            setSettingsValid(value.length > 2 && channelName.length > 2);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (areSettingsValids)
            console.log(`${channelType} channel ${channelName} created ${channelType == "Protected"? `password: ${channelPassword}` : ""}`);
    }
//todo: afficher uniquement en cas de clique sur le bouton d ajout + deplacer les boutons de settings vers le haut
    return (
        <div className={className}>
            <h1>CREATE NEW CHANNEL</h1>
            <form>
                <label>
                    <input id={"channelNameInput"} type={"text"} autoFocus={true}
                           inputMode={"text"} minLength={3} maxLength={12} placeholder={"Channel Name"}
                           value={channelName} onChange={handleOnNameChange}/>
                </label>
                <label id={"visibility_block"}>Visibility: ({channelType})
                    <ul >
                        <li><label> <input type="radio" name="visibility" value="Public" onChange={handleOnChange} /> Public</label></li>
                        <li><label> <input type="radio" name="visibility" value="Protected" onChange={handleOnChange} /> Protected</label></li>
                        {channelType == "Protected" &&
                            <li><label>
                                <input id={"channelPasswordInput"} type={"text"} inputMode={"text"}
                                       minLength={3} maxLength={12} value={channelPassword}
                                       placeholder={"Password"} autoFocus={true} onChange={handleOnPasswordChange}/>
                        </label></li>}
                        <li><label> <input type="radio" name="visibility" value="Private" onChange={handleOnChange} /> Private</label> </li>
                    </ul>

                </label>
                <button onClick={handleSubmit} disabled={!areSettingsValids}>
                    {areSettingsValids && <Image
                        src="/confirm.svg"
                        alt="add new channel button"
                        width={32}
                        height={32}
                        disabled={channelType.length == 0}
                    />}
                </button>
            </form>
        </div>
    )
}

export default ChatNewChannelPopup;