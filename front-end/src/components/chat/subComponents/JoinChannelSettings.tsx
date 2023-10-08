import {input} from "zod";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import Button from "@/components/CustomButtonComponent";

const JoinChannelSettings = ({className}) => {
    const [channelName, setChannelName] = useState("");
    const [channelPassword, setChannelPassword] = useState("");
    const [areSettingsValids, setSettingsValid] = useState(false);
    const [showPassword, setPasswordVisible] = useState("password");
    const [isChannelJoined, setIsChannelJoined] = useState(false);

    useEffect(() => {
        if (channelName.length < 3)
            setSettingsValid(false);
         else {
            setSettingsValid(true);
        }
    }, [channelName]);

    function handleOnNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setChannelName(value);
    }

    function handleOnPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setChannelPassword(value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (areSettingsValids)
        {
            setIsChannelJoined(true);
        }
    }

    function handleShowPassword(event){
        event.preventDefault();
        setPasswordVisible(showPassword == "text" ? "password" : "text");
    }

    return (
        <>
            {!isChannelJoined && <div className={className}>
                <h1 id={"popup_title"}>JOIN A CHANNEL</h1>
                {/* <form>
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
                    </label>
                    <label id={"visibility_block"}>Password required ?
                        <label>
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
                        </label>
                    </label>
                    <button onClick={handleSubmit} disabled={!areSettingsValids}>
                        {areSettingsValids && <Image
                            src="/confirm.svg"
                            alt="add new channel button"
                            width={32}
                            height={32}
                        />}
                    </button>
                </form> */}
            </div>}
        </>
    )
}

export default JoinChannelSettings;