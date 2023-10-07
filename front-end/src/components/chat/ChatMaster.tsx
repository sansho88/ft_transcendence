'use client'

import React, { useContext, useEffect, useState, useRef, createContext } from 'react'
import { LoggedContext, SocketContextChat } from '@/context/globalContext'
import { IChannel } from '@/shared/typesChannel'
import { Channel } from './class/Channel'
import ChatInput from './subComponents/ChatInput'
import ChatChannelList from './subComponents/ChatChannelList'
import ChatMessagesList from './subComponents/ChatMessagesList'
import { Socket } from 'socket.io-client'
import { ChannelsServerManager } from './class/ChannelsServerManager'
import { IUser } from '@/shared/types'
import { wsChatEvents, wsChatListen } from '../api/WsReq'
import { IChannelEntity } from '@/shared/entities/IChannel.entity'
import { channel } from 'diagnostics_channel'
import * as apiReq from '../api/ApiReq'

import ChatNewChannelPopup from "@/components/chat/subComponents/ChatNewChannelPopup";


export default function ChatMaster({className, token}: {className: string, token: string}) {

  const [channelsServer, setChannelsServer] = useState<IChannel[]>([]) //recuperer tous les channels server
  const [channels, setChannels] = useState<IChannel[]>([]) //list des channels JOINED
  const [messagesChannel, setMessagesChannel] = useState<IChannel[]>() //les messages actuellement load du channel
  const [currentChannel, setCurrentChannel] = useState<number>(-1); // definir le channel en cours by ID


  const socketChat = useContext(SocketContextChat);
  const {logged, setLogged} = useContext(LoggedContext);

  const setterCurrentChannel = (newIdChannel: number) => {
    console.log('helloSetter')
    setCurrentChannel(newIdChannel);
  }

  if(socketChat?.disconnected) 
  { 
    console.log(`token = ${token}`);
    socketChat.auth = { type: `Bearer`, token: `${token}` };
    socketChat.connect();
  }

  useEffect(() => {
    console.log('Vraiment pas modif ?')
  }, [currentChannel])


  useEffect(() => {

      if (socketChat){
        wsChatListen.infoRoom(socketChat); //DBG
        wsChatListen.createRoomListen(socketChat, setChannels);
        wsChatListen.updateChannelsJoined(socketChat, setChannels);
        wsChatEvents.pingUpdateChannelsJoined(socketChat);
        //TODO: listen all channel por udpate temps reel liste join et channel total
      }
  
    return (() => {
      socketChat?.disconnect();
    })
  }, [])



  useEffect(() => {
    console.log(`currentChannel =  ${currentChannel}`);
    //TODO Charger les messages du channel correspondant
  }, [currentChannel])

  useEffect(() => {
    console.log(`CHANNELS UPDATED =  ${JSON.stringify(channels)}`);


  }, [channels])

  useEffect(() => {
    if (socketChat?.connected)
    {
      // var user1 : IUser = {has_2fa: false, login: "ben", status: 0,     UserID: 1, nickname: 'BenNick'};
      // const chan0: CreateChannelDTOPipe = {name: "chan1", privacy: false}; 

      // setChannels([...Channels, chan0, chan1, chan2, chan3] )
      // manager.current.addChannel(chan0);
      // manager.current.addChannel(chan1);
      // manager.current.addChannel(chan2);
      // manager.current.addChannel(chan3);
    }
  }, [socketChat?.connected])
  
  return (
    <div className={`${className}`}>
      {socketChat?.active ? 
        <ChatChannelList className={'chat_channel_block'} socket={socketChat} channels={channels} setCurrentChannel={setterCurrentChannel} /> : <></> }
      
      <div className='chat_block_main'>
        <ChatMessagesList className='chat_message_list' messages={[]} /> {/* TODO: charger ref liste message channel en cours*/}
        {socketChat?.active ? 
        <ChatInput className={'chat_block_messages_input'} socket={socketChat} channelID={currentChannel} /> : <></>}
      </div>

    </div>
  )
}
