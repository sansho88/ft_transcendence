import React, {useState} from "react";
import CreateChannelSettings from "@/components/chat/subComponents/CreateChannelSettings";
import JoinChannelSettings from "@/components/chat/subComponents/JoinChannelSettings";
import { Socket } from "socket.io-client";
import { channel } from "diagnostics_channel";
import { IChannel } from "@/shared/typesChannel";

const ChatNewChannelPopup = ({className, socket, channels, currentChannel,setterCurrentChannel }
    : {
        className: string, 
        socket: Socket,
        channels: IChannel[],
        currentChannel: number,
        setterCurrentChannel: Function

    
    }) => {
    const [selectedMode, setSelectedMode] = useState("");

    function handleClickCreate(){
        setSelectedMode("CREATE");
    }
     function handleClickJoin(){
        setSelectedMode("JOIN");
    }



    return (
        <>
            {selectedMode.length == 0 && (
                <div className={className}>
                    <h1 id={"popup_title"}>CHANNEL</h1>
                    <button id={"button_select_channel_mode"} onClick={handleClickCreate}>CREATE</button>
                    <button id={"button_select_channel_mode"} onClick={handleClickJoin}>JOIN</button>
                </div>
            )}
            {selectedMode == "CREATE" && <CreateChannelSettings className={className} socket={socket}/> }
            {selectedMode == "JOIN" &&    <JoinChannelSettings 
                                                    className={className}
                                                    channels={channels}
                                                    currentChannel={currentChannel}
                                                    setterCurrentChannel={setterCurrentChannel}
                                                    socketChat={socket}
                                                    channelsServer={[]}
                                                    />}
        </>
    )
}

export default ChatNewChannelPopup;