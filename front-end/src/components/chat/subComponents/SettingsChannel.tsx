import {input} from "zod";
import React, {useContext, useEffect, useState} from "react";
import Image from "next/image";
import Button from "@/components/CustomButtonComponent";
import {channelsDTO} from "@/shared/DTO/InterfaceDTO";
import { wsChatEvents } from "@/components/api/WsReq";
import { Socket } from "socket.io-client";
import {CurrentChannelContext, SocketContextChat} from "@/context/globalContext";
import {IChannel} from "@/shared/typesChannel";
import * as apiReq from "@/components/api/ApiReq"
import { channel } from "diagnostics_channel";

const SettingsChannel = ({className, socket, channelToEdit}: {className: string, socket: Socket, channelToEdit: IChannel}) => {
    const [channelName, setChannelName] = useState(channelToEdit.name);
    const [channelPassword, setChannelPassword] = useState(channelToEdit.password ? channelToEdit.password : "");
    const [channelType, setChannelType] = useState(channelToEdit.type ? "Private" : channelToEdit.password ? "Protected" : "Public");
    const [areSettingsValids, setSettingsValid] = useState(true);
    const [showPassword, setPasswordVisible] = useState(channelToEdit.password);
    const [nameErrorMsg, setNameErrMsg] = useState("");
    const [passwordErrorMsg, setPasswordErrMsg] = useState("");
    const [isChannelEdited, setIsChannelEdited] = useState(false);
    const {selectedChannel, editSelectChannel} = useContext(CurrentChannelContext);

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
            console.log(`${channelType} channel ${channelName} created ${channelType == "Protected" ? `password: ${channelPassword}` : ""}`);
            setIsChannelEdited(true);

            // const newEditedChannel : IChannel = {
            const newEditedChannel : channelsDTO.IChangeChannelDTOPipe = {
                channelID: channelToEdit.channelID,
                name: channelName,
                privacy: channelType == "Private",
                password: channelPassword ? channelPassword : null
            }
            // apiReq.putApi.putModifChannel(channelToEdit.channelID, newEditedChannel)//FIXME:
            // .then(() => {
            //     console.log('tous va bien dans le meilleur des mondes')
            // })
            // .catch((e) => {
            // console.error(e)})
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