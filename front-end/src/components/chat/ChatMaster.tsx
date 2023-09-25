'use client'

import { IChannel, IChannelMessage } from '@/shared/typesChannel'
import {Channel} from './subComponents/Channel'
import React, { useContext, useEffect, useState } from 'react'
import ChatChannelList from './subComponents/ChatChannelList'
import ChatMessage from './subComponents/elements/ChatMessageListElement'
import ChatInput from './subComponents/ChatInput'
import { SocketContextChat } from '@/context/globalContext'
import ChatMessagesList from './subComponents/ChatMessagesList'

export default function ChatMaster({className, token}: {className: string, token: string}) {

  const [Channels, setChannels] = useState<IChannel[]>()
  const [messagesChannel, setMessagesChannel] = useState<IChannel[]>()
  const [currentChannel, setCurrentChannel] = useState<number>(-1);

  const socketChat = useContext(SocketContextChat);

  if(socketChat?.disconnected)
  { 
    console.log(`token = ${token}`);
    socketChat.auth = { type: `Bearer`, token: `${token}` };
    socketChat.connect();
  }
  
  useEffect(() => {


  }, [])

  // const testChan: Channel = new Channel({channelID: 0, name: '#chan0', ownerUserID: 0, ownerLogin: 'user1', type: 0})

  return (
    <div className={`bg-slate-950 flex w-full h-full rounded-xl ${className}`}>
      <ChatChannelList className={' bg-slate-900 flex w-1/3 h-full rounded-l-xl'} />
      
      <div className='flex flex-col w-2/3 h-full'>
        <div className=''>
          <ChatMessagesList />
        </div>
        <ChatInput className={' absolute bottom-0 h-20 justify-center'}/>
      </div>
    
    </div>
  )
}
