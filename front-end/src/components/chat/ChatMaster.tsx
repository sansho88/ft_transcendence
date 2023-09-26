'use client'

import React, { useContext, useEffect, useState, useRef } from 'react'
import { SocketContextChat } from '@/context/globalContext'
import { IChannel, IChannelMessage } from '@/shared/typesChannel'
import { Channel } from './subComponents/Channel'
import ChatInput from './subComponents/ChatInput'
import ChatChannelList from './subComponents/ChatChannelList'
import ChatMessagesList from './subComponents/ChatMessagesList'
import { Socket } from 'socket.io-client'
import { ChannelsManager } from './subComponents/ChannelsManager'

export default function ChatMaster({className, token}: {className: string, token: string}) {

  const [Channels, setChannels] = useState<IChannel[]>([])
  const [messagesChannel, setMessagesChannel] = useState<IChannel[]>()
  const [currentChannel, setCurrentChannel] = useState<number>(-1);

  const manager = useRef<ChannelsManager>(new ChannelsManager());

  const socketChat = useContext(SocketContextChat);

  if(socketChat?.disconnected) 
  { 
    console.log(`token = ${token}`);
    socketChat.auth = { type: `Bearer`, token: `${token}` };
    socketChat.connect();
  }
  
  useEffect(() => {
    console.log(`currentChannel =  ${currentChannel}`);
    //TODO Charger les messages du channel correspondant
  }, [currentChannel])

  useEffect(() => {
    if (socketChat?.connected)
    {
      const chan0 = new Channel({ channelID: 0, name: 'chan0', ownerUserID: 0, type: 0, ownerLogin: 'ben'       }, socketChat)
      const chan1 = new Channel({ channelID: 1, name: 'chan1', ownerUserID: 0, type: 0, ownerLogin: 'bducrocq'  }, socketChat)
      const chan2 = new Channel({ channelID: 2, name: 'chan2', ownerUserID: 0, type: 0, ownerLogin: 'babar'     }, socketChat)
      const chan3 = new Channel({ channelID: 3, name: 'chan3', ownerUserID: 0, type: 0, ownerLogin: 'zephyr'    }, socketChat)
      // setChannels([...Channels, chan0, chan1, chan2, chan3] )
      manager.current.addChannel(chan0);
      manager.current.addChannel(chan1);
      manager.current.addChannel(chan2);
      manager.current.addChannel(chan3);
    }
  }, [socketChat?.connected])

  // const testChan: Channel = new Channel({channelID: 0, name: '#chan0', ownerUserID: 0, ownerLogin: 'user1', type: 0})

  return (
    <div className={`bg-slate-950 flex w-full h-full rounded-xl ${className}`}>
      <ChatChannelList className={' bg-slate-900 flex-grow w-1/3 h-full rounded-l-xl'} setChannel={console.log} />

      <div className='flex-col w-2/3 h-full'>
        <div className=''>
          {/* <ChatMessagesList className='' messages={ } /> */}
        </div>
        <ChatInput className={' absolute bottom-0 h-20 justify-center'} />
      </div>

    </div>
  )
}
