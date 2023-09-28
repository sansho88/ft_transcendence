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
      const chan0 = new Channel({ channelID: 0, name: 'chan0', ownerUserID: 1, type: 0, ownerLogin: 'ben'       }, socketChat)
      const chan1 = new Channel({ channelID: 1, name: 'chan1', ownerUserID: 1, type: 0, ownerLogin: 'bducrocq'  }, socketChat)
      const chan2 = new Channel({ channelID: 2, name: 'chan2', ownerUserID: 1, type: 0, ownerLogin: 'babar'     }, socketChat)
      const chan3 = new Channel({ channelID: 3, name: 'chan3', ownerUserID: 1, type: 0, ownerLogin: 'zephyr'    }, socketChat)
      // setChannels([...Channels, chan0, chan1, chan2, chan3] )
      manager.current.addChannel(chan0);
      manager.current.addChannel(chan1);
      manager.current.addChannel(chan2);
      manager.current.addChannel(chan3);
    }
  }, [socketChat?.connected])
  
  const sys0: IChannelMessage = {channelID: 0, content: 'ben has created this channel', ownerUser:                      {has_2fa: false, login: "system", status: 0,  UserID: 0, nickname: 'Benj3D'}}
  const mess1: IChannelMessage = {channelID: 0, content: 'Hello, ceci est un message de test code en dur', ownerUser:   {has_2fa: false, login: "ben", status: 0,     UserID: 1, nickname: 'BenNick'}}
  const mess2: IChannelMessage = {channelID: 0, content: 'c\'est la deuxieme ligne du message de test', ownerUser:      {has_2fa: false, login: "ben", status: 0,     UserID: 1, nickname: 'BenNick'}}
  const mess3: IChannelMessage = {channelID: 0, content: 'et ca la troisieme ligne', ownerUser:                         {has_2fa: false, login: "ben", status: 0,     UserID: 1, nickname: 'BenNick'}}
  const sys1: IChannelMessage = {channelID: 0, content: 'bducrocq has join this channel', ownerUser:                    {has_2fa: false, login: "system", status: 0,  UserID: 0, nickname: 'none'}}
  const mess4: IChannelMessage = {channelID: 0, content: 'Hello et moi je suis un autre user', ownerUser:               {has_2fa: false, login: "bducrocq", status: 2,UserID: 2, nickname: 'Benj3D'}}
  
  // const testChan: Channel = new Channel({channelID: 0, name: '#chan0', ownerUserID: 0, ownerLogin: 'user1', type: 0})


  return (
    <div className={`${className}`}>
      <ChatChannelList className={'chat_channel_block'} setChannel={console.log} />

      <div className='chat_block_main'>
        <ChatMessagesList className='chat_message_list' messages={[sys0, mess1, mess2, mess3, sys1, mess4, sys0, mess1, mess2, mess3, sys1, mess4]} />
        <ChatInput className={'chat_block_messages_input'} />
      </div>

    </div>
  )
}
