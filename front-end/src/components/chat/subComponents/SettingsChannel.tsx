import React, {useContext, useEffect, useState} from "react";
import Image from "next/image";
import Button from "@/components/CustomButtonComponent";
import {channelsDTO} from "@/shared/DTO/InterfaceDTO";
import { wsChatEvents } from "@/components/api/WsReq";
import { Socket } from "socket.io-client";
import {CurrentChannelContext} from "@/context/globalContext";
import {IChannel} from "@/shared/typesChannel";
import {v4 as uuidv4} from "uuid";

const SettingsChannel = ({className, socket, channelToEdit}: {className: string, socket: Socket, channelToEdit: IChannel}) => {
    const [channelName, setChannelName] = useState(channelToEdit.name);
    const [channelPassword, setChannelPassword] = useState(channelToEdit.password ? channelToEdit.password : "");
    const [channelType, setChannelType] = useState(channelToEdit.type ? "Private" : channelToEdit.password ? "Protected" : "Public");
    const [areSettingsValids, setSettingsValid] = useState(true);
    const [showPassword, setPasswordVisible] = useState(channelToEdit.password);
    const [nameErrorMsg, setNameErrMsg] = useState("");
    const [passwordErrorMsg, setPasswordErrMsg] = useState("");
    const [isChannelEdited, setIsChannelEdited] = useState(false);

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
            setIsChannelEdited(true);

            const newEditedChannel : channelsDTO.IChangeChannelDTOPipe = {
                channelID: channelToEdit.channelID,
                name: channelName,
                privacy: channelType == "Private",
                password: channelPassword ? channelPassword : null
            }
           
            wsChatEvents.updateChannel(socket, newEditedChannel); // utilisation ws pour update tous les clients ensuite
        }

    }

    function handleShowPassword(event){
        event.preventDefault();
        setPasswordVisible(showPassword == "text" ? "password" : "text");
    }

    return (
        <>
            {!isChannelEdited && <div className={className}>
                <h1 id={"popup_title"}>EDIT CHANNEL</h1>
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
                                               onChange={handleOnChange} checked={channelType == "Public"}/> Public</label></li>

                            <li><label> <input type="radio"
                                               name="visibility"
                                               value="Protected"
                                               onChange={handleOnChange} checked={channelType == "Protected"}/> Protected</label></li>
                            {channelType == "Protected" &&
                                <li><label>
                                    <input type={"text"} name={"username"} hidden={true} autoComplete={"username"}/>
                                    <input className={`channelPasswordInput`}
                                           id={`channelPasswordInput${uuidv4()}`}
                                           type={showPassword}
                                           inputMode={"text"}
                                           minLength={3}
                                           maxLength={12}
                                           value={channelPassword}
                                           placeholder={" Password"}
                                           autoFocus={true}
                                           onChange={handleOnPasswordChange}
                                           autoComplete={"current-password"}
                                    />
                                    <Button className={`button_showPassword`} id={`button_showPassword${uuidv4()}`} image={showPassword == "password" ? "/eye-off.svg" : "/eye-show.svg"}
                                            onClick={handleShowPassword}
                                            alt={"Show password button"}/>
                                    <p style={{fontSize: "12px", color: "red"}}>{passwordErrorMsg}</p>
                                </label></li>}

                            <li><label> <input type="radio" name="visibility" value="Private"
                                               onChange={handleOnChange} checked={channelType == "Private"}/> Private</label></li>
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

export default SettingsChannel;