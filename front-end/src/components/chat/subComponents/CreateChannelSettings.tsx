import {input} from "zod";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import Button from "@/components/CustomButtonComponent";
import { channelsDTO } from "@/shared/DTO/InterfaceDTO";
import { wsChatEvents } from "@/components/api/WsReq";
import { Socket } from "socket.io-client";

const CreateChannelSettings = ({className, socket}: {className: string, socket: Socket}) => {
    const [channelName, setChannelName] = useState("");
    const [channelPassword, setChannelPassword] = useState("");
    const [channelType, setChannelType] = useState("");
    const [areSettingsValids, setSettingsValid] = useState(false);
    const [showPassword, setPasswordVisible] = useState("password");
    const [nameErrorMsg, setNameErrMsg] = useState("");
    const [passwordErrorMsg, setPasswordErrMsg] = useState("");
    const [isChannelCreated, setIsChannelCreated] = useState(false);

    useEffect(() => {
        if (channelName.length < 3)
            setSettingsValid(false);
        else if (channelType.length > 0 && channelType != "Protected") {
            setSettingsValid(true);
        } else if (channelType == "Protected" && channelPassword.length > 2) {
            setSettingsValid(true);
        } else {
            setSettingsValid(false);
        }

        if (channelType != "Protected")
            setChannelPassword("");

    }, [channelName, channelType, channelPassword]);

    const handleOnChange = (event) => {
        setChannelType(event.target.value);
    };

    function handleOnNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setChannelName(value);

        if (value.length < 3 || value.length > 12) {
            setNameErrMsg("Length: 3 => 12");
        }
        else if (!/^[A-Za-z0-9_]+$/.test(value)) {
            setNameErrMsg("Alphanumerics only");
        }
        else
            setNameErrMsg("");
    }

    function handleOnPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setChannelPassword(value);

        if (value.length < 3 || value.length > 12) {
            setPasswordErrMsg("min. 3 characters");
        }
        else if (!/^[A-Za-z0-9_]+$/.test(value)) {
            setPasswordErrMsg("Alphanumerics only");
        }
        else
            setPasswordErrMsg("");
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (areSettingsValids)
        {
            // console.log(`${channelType} channel ${channelName} created ${channelType == "Protected" ? `password: ${channelPassword}` : ""}`);
            setIsChannelCreated(true);
            
            const newChannel: channelsDTO.ICreateChannelDTOPipe = {
                name: channelName,
                privacy: channelType === "Private",
                password: channelType === "Protected" ? channelPassword : undefined
              }



              wsChatEvents.createRoom(socket, newChannel);
          }
        
    }

    function handleShowPassword(event){
        event.preventDefault();
        setPasswordVisible(showPassword == "text" ? "password" : "text");
    }

//todo: afficher uniquement en cas de clique sur le bouton d ajout + deplacer les boutons de settings vers le haut
    return (
        <>
            {!isChannelCreated && <div className={className}>
                <h1 id={"popup_title"}>NEW CHANNEL</h1>
                <form>
                    <label>
                        <input id={"channelNameInput"}
                               type={"text"}
                               autoFocus={true}
                               inputMode={"text"}
                               minLength={3}
                               maxLength={12}
                               placeholder={" Name"}
                               value={channelName}
                               onChange={handleOnNameChange}/>
                        <p style={{fontSize: "12px", color: "red"}}>{nameErrorMsg}</p>
                    </label>
                    <label id={"visibility_block"}>Visibility:
                        <ul>
                            <li><label> <input type="radio"
                                               name="visibility"
                                               value="Public"
                                               onChange={handleOnChange}/> Public</label></li>

                            <li><label> <input type="radio"
                                               name="visibility"
                                               value="Protected"
                                               onChange={handleOnChange}/> Protected</label></li>
                            {channelType == "Protected" &&
                                <li><label>
                                    <input id={"channelPasswordInput"}
                                           type={showPassword}
                                           inputMode={"text"}
                                           minLength={3}
                                           maxLength={12}
                                           value={channelPassword}
                                           placeholder={" Password"}
                                           autoFocus={true}
                                           onChange={handleOnPasswordChange}/>
                                    <Button id={"button_showPassword"} image={showPassword == "password" ? "/eye-off.svg" : "/eye-show.svg"}
                                            onClick={handleShowPassword}
                                            alt={"Show password button"}/>
                                    <p style={{fontSize: "12px", color: "red"}}>{passwordErrorMsg}</p>
                                </label></li>}

                            <li><label> <input type="radio" name="visibility" value="Private"
                                               onChange={handleOnChange}/> Private</label></li>
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
            </div>}
        </>
    )
}

export default CreateChannelSettings;