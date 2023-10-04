import {input} from "zod";
import React, {useState} from "react";
import Image from "next/image";

const ChatNewChannelPopup = ({className}) => {
    const [channelName, setChannelName] = useState("");
    const [channelPassword, setChannelPassword] = useState("");
    const [channelType, setChannelType] = useState("Public");

    function handleOnChange(event){
        setChannelType( event.target.value);
    }

    function handleOnNameChange(event: React.ChangeEvent<HTMLInputElement>){
        const value = event.target.value;
        setChannelName(value);
    }
    function handleOnPasswordChange(event: React.ChangeEvent<HTMLInputElement>){
            const value = event.target.value;
            setChannelPassword(value);
        }
//todo: afficher uniquement en cas de clique sur le bouton d ajout + deplacer les boutons de settings vers le haut
    return (
        <div className={className}>
            <h1>CREATE NEW CHANNEL</h1>
            <form>
                <label>Channel Name
                    <input id={"channelNameInput"} type={"text"} autoFocus={true} inputMode={"text"} minLength={3} maxLength={12} value={channelName} onChange={handleOnNameChange}/>
                </label>
                <label >Visibility:
                    <ul>
                        <li><label> <input type="radio" name="visibility" value="Public" onChange={handleOnChange} autoFocus={true}/> Public</label></li>
                        <li><label> <input type="radio" name="visibility" value="Protected" onChange={handleOnChange}/> Protected</label></li>
                        {channelType == "Protected" &&
                            <li><label>Password:
                                <input id={"channelPasswordInput"} type={"text"} inputMode={"text"} minLength={3} maxLength={12} value={channelPassword} onChange={handleOnPasswordChange}/>
                        </label></li>}
                        <li><label> <input type="radio" name="visibility" value="Private" onChange={handleOnChange}/>Private</label> </li>
                    </ul>
                </label>
                <button onClick={() => console.log(`${channelType} channel ${channelName} created`)}>
                    <Image
                        src="/confirm.svg"
                        alt="add new channel button"
                        width={32}
                        height={32}
                    />
                </button>
            </form>
        </div>
    )
}

export default ChatNewChannelPopup;