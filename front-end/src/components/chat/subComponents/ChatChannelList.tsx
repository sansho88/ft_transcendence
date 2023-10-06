'use client'

import React, { useEffect, useRef, useState } from 'react'
import ChatChannelListElement from './elements/ChatChannelListElement'
import Image from "next/image";
import { wsChatEvents, wsChatListen } from '@/components/api/WsReq';
import { Socket } from 'socket.io-client';
import { EChannelType, IChannel } from '@/shared/typesChannel';
import { channelsDTO } from '@/shared/DTO/InterfaceDTO';
import ChatNewChannelPopup from "@/components/chat/subComponents/ChatNewChannelPopup";


export default function ChatChannelList({className, socket, channels, setCurrentChannel}
  : {className: string, socket: Socket, channels: IChannel[], setCurrentChannel: Function}) {

  const counterDBG = useRef<number>(0);

  const [isPopupVisible, setPopupVisible] = useState(false); 
  const addChannel = () => {

    const action = () => { 
      counterDBG.current++;
      const newChannel: channelsDTO.ICreateChannelDTOPipe = {
        name: `chan${counterDBG.current}`,
        privacy: false,
        // password: ''
      }
      wsChatEvents.createRoom(socket, newChannel);
    }


    return (
      <>
        <button onClick={() => setPopupVisible(!isPopupVisible)}>
        {/* <button onClick={() => action()}> for DBG action */}

          <Image
              src="/channel-add.svg"
              alt="ADD CHANNEL BUTTON"
              width={26}
              height={22}
          />
        </button>
    { isPopupVisible && <ChatNewChannelPopup className={"chat_new_channel_popup"} socket={socket}/>}
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
              isInvite={false}
              f={() => {
                wsChatEvents.joinRoom(socket, channel) //FIXME: IST JUST FOR DEV
                setCurrentChannel(channel.channelID);
              }}
            />
          ))
        }
        <ChatChannelListElement channelID={1} channelName='#Channel 1' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={2} channelName='#Channel 2' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={3} channelName='#Channel 3' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={4} channelName='#Channel 4' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={5} channelName='#Channel 5' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={6} channelName='#Channel 6' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={7} channelName='#Channel 7' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={8} channelName='#Channel 8' f={setCurrentChannel} isInvite={true}/>
        <ChatChannelListElement channelID={9} channelName='#Channel 9' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={10} channelName='#Channel 10' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={11} channelName='#Channel 11' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={12} channelName='#Channel 12' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={13} channelName='#Channel 13' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={14} channelName='#Channel 14' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={15} channelName='#Channel 15' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={16} channelName='#Channel 16' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={17} channelName='#Channel 17' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={18} channelName='#Channel 18' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={19} channelName='#Channel 19' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={20} channelName='#Channel 20' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={21} channelName='#Channel 21' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={22} channelName='#Channel 22' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={23} channelName='#Channel 23' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={24} channelName='#Channel 24' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={25} channelName='#Channel 25' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={26} channelName='#Channel 26' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={27} channelName='#Channel 27' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={28} channelName='#Channel 28' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={29} channelName='#Channel 29' f={setCurrentChannel} isInvite={false}/>
        <ChatChannelListElement channelID={30} channelName='#Channel 30' f={setCurrentChannel} isInvite={false}/>

      </div>
      <div className='chat_channel_buttons'>
        {addChannel()} &nbsp; &nbsp; | &nbsp; &nbsp; {paramChannel()}
      </div>
    </div>
  )
}
