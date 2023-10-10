'use client'

import React, {useEffect, useRef, useState} from 'react'
import {v4 as uuidv4} from "uuid";


export default function ChatChannelListElement({channelID, channelName, f, isInvite, currentChannel, isMp}: {
    channelID: number,
    channelName: string,
    f: Function,
    isInvite: boolean,
    currentChannel: number,
    isMp: boolean
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

    const defineClassName = useRef<string>('chat_channel_list_element')
    useEffect(() => {
			if (!isMp) 
            {
				if (currentChannel === channelID)
					defineClassName.current = ' chat_channel_list_element \
                                                chat_channel_list_element_selected';
				else 
                    defineClassName.current = ' chat_channel_list_element';
			} 
            else
            {
                if (currentChannel === channelID)
				defineClassName.current = ' chat_channel_list_element\
                                            chat_channel_list_element_mp \
                                            chat_channel_list_element_selected';
			    else 
                    defineClassName.current = ' chat_channel_list_element \
                                                chat_channel_list_element_mp';
            } 
		}, [currentChannel]);

    return (
        <div className={currentChannel === channelID ? `channel channel_selected` : `channel`}>
            <div key={`button_channel_${uuidv4()}`}
                 className={defineClassName.current} onClick={() => f(channelID)}>{channelName}
            </div>
            {isPending && (<div id={"invite_options"}>
                <span onClick={ handleAcceptInvite }>✅</span> |
                <span onClick={ handleDeclineInvite }>❌</span>
            </div>)}
        </div>
    )
}

