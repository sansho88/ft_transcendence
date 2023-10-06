'use client'

import React, {useState} from 'react'
import {v4 as uuidv4} from "uuid";


export default function ChatChannelListElement({channelID, channelName, f, isInvite}: {
    channelID: number,
    channelName: string,
    f: Function,
    isInvite: boolean
}) {
    const [isPending, setIsPending] = useState(isInvite);

//   return (
//     <button key={`button_channel_${uuidv4()}`} 
//     className='chat_channel_list_element' onClick={() => f(channelID)}> {channelName}</button>
//   )
    function handleAcceptInvite() {
        console.log(`Invite to ${channelName} accepted`);
        setIsPending(false);
    }

    function handleDeclineInvite() {
        console.log(`Invite to ${channelName} declined`);
        setIsPending(false);
    }

    return (
        <div className={"channel"}>
            <div key={`button_channel_${uuidv4()}`}
                 className='chat_channel_list_element' onClick={() => f(channelID)}>{channelName}
            </div>
            {isPending && (<div id={"invite_options"}>
                <span onClick={handleAcceptInvite}>✔</span> |
                <span onClick={handleDeclineInvite}>❌</span>
            </div>)}
        </div>
    )
}
