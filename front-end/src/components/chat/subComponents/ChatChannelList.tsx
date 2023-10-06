'use client'

import React, { useEffect, useRef, useState } from 'react'
import ChatChannelListElement from './elements/ChatChannelListElement'
import Image from "next/image";
import { wsChatEvents, wsChatListen } from '@/components/api/WsReq';
import { Socket } from 'socket.io-client';
import { IChannel } from '@/shared/typesChannel';
import { channel } from 'diagnostics_channel';
import ChatNewChannelPopup from "@/components/chat/subComponents/ChatNewChannelPopup";


export default function ChatChannelList({className, socket, channels, setCurrentChannel}: {className: string, socket: Socket, channels: IChannel[], setCurrentChannel: Function}) {

  const counterDBG = useRef<number>(0);

  const addChannel = () => {

    const action = () => {
    counterDBG.current++;
    wsChatEvents.createRoom(socket, {name: `chan${counterDBG.current}`, privacy: false});
    }

    const [isPopupVisible, setPopupVisible] = useState(false);



    return (
      <>
        <button onClick={() => setPopupVisible(!isPopupVisible)}>

          <Image
              src="/channel-add.svg"
              alt="ADD CHANNEL BUTTON"
              width={26}
              height={22}
          />
        </button>
    { isPopupVisible && <ChatNewChannelPopup className={"chat_new_channel_popup"}/>}
      </>
    )
  }
  const paramChannel = () => {
    return (

        <button onClick={() => console.log('OPEN PARAM CURRENT CHANNEL POPUP')}>
          <Image
              src="/settings.svg"
              alt="OPEN PARAMS BUTTON"
              width={18}
              height={18}
          />
        </button>
    )
  }

  useEffect(() => {
    console.log('chatChannelList: channels useEffect!')

  }, [channels])

  return (

    <div className={`${className}`}>
      <div className={`chat_channel_list`}>
        {/* <ChatChannelListElement channelID={1} channelName='#Channel 1' f={setChannels(channel)} /> */}
        {/* <button onClick={() => setCurrentChannel(2)}> AHHH </button> */}
        {channels &&
        channels.map((channel) => (
          <ChatChannelListElement 
            key={channel.channelID} 
            channelID={channel.channelID} 
            channelName={channel.name} 
            f={() => {
              socket.emit(wsChatEvents.)
              setCurrentChannel(channel.channelID);
            }} 
          />
        ))
      }
      </div>
      <div className='chat_channel_buttons'>
        {addChannel()} &nbsp; &nbsp; | &nbsp; &nbsp; {paramChannel()}
      </div>
    </div>
  )
}
