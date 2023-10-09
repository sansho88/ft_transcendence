import React, {useState} from "react";
import CreateChannelSettings from "@/components/chat/subComponents/CreateChannelSettings";
import JoinChannelSettings from "@/components/chat/subComponents/JoinChannelSettings";

const ChatNewChannelPopup = ({className}) => {
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
            {selectedMode == "CREATE" && <CreateChannelSettings className={className}/> }
            {selectedMode == "JOIN" &&    <JoinChannelSettings className={className}/>}
        </>
    )
}

export default ChatNewChannelPopup;