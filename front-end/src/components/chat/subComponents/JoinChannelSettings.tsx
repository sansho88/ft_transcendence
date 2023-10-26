import {input} from "zod";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import Button from "@/components/CustomButtonComponent";
import ChatChannelList from "./ChatChannelList";
import { IChannel } from "@/shared/typesChannel";
import { Socket } from "socket.io-client";
import * as apiReq from "@/components/api/ApiReq"
import { IChannelEntity } from "@/shared/entities/IChannel.entity";

const JoinChannelSettings = ({className, channels, channelsServer, socketChat, setterCurrentChannel, currentChannel}
    :{
        className: string,
        channels: IChannel[],
        channelsServer: IChannel[],
        socketChat: Socket,
        setterCurrentChannel: Function,
        currentChannel: number, 
    }) => {
    const [channelName, setChannelName] = useState("");
    const [channelPassword, setChannelPassword] = useState("");
    const [areSettingsValids, setSettingsValid] = useState(false);
    const [showPassword, setPasswordVisible] = useState("password");
    const [isChannelJoined, setIsChannelJoined] = useState(false);
    const [channelServer3, setChannelServer3] = useState<IChannelEntity[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const channelsServer2 = async () => {
        return apiReq.getApi.getChannels();
    }


    useEffect(() => {
        const channelsServer2 = async () => {
            const channel = await apiReq.getApi.getChannels();
            setChannelServer3(channel);
            setIsLoading(true)
        }
        channelsServer2()
    }, [])



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
            {!isChannelJoined && isLoading && 
            <div className={`${className} max-h-72 overflow-y-auto  chat_message_list_sub`}>
                <h1 id={"popup_title"}>JOIN A CHANNEL</h1>
                <ChatChannelList  className={'chat_channel_block'}
                          socket={socketChat}
                          channels={channels}
                          setCurrentChannel={setterCurrentChannel}
                          currentChannel={currentChannel}
                          channelsServer={channelServer3.data}
                          isServerList={true} 
                          />
            </div>}
        </>
    )
}

export default JoinChannelSettings;