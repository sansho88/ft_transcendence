'use client'

import React, { useContext, useEffect, useState, useRef, createContext } from 'react'
import { LoggedContext, SocketContextChat, UserContext } from '@/context/globalContext'
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
import { IMessageEntity } from '@/shared/entities/IMessage.entity'
import { messageDTO } from '@/shared/DTO/InterfaceDTO'
import { wsChatRoutesBack } from '@/shared/routesApi'
import RightClik from './subComponents/RightClik'


export default function ChatMaster({className, token, userID}: {className: string, token: string, userID: number}) {
  const timeoutRefreshMessage: number = 150; //ajoute un timeout pour laisser le temps au message de se charger
 

  const [channelsServer, setChannelsServer] = useState<IChannel[]>([]) //recuperer tous les channels server
  const [channels, setChannels] = useState<IChannel[]>([]) //list des channels JOINED
  const [messagesChannel, setMessagesChannel] = useState<messageDTO.IReceivedMessageEventDTO[]>([]) //les messages actuellement load du channel //TODO: faire route ws avec ping et update
  const [currentChannel, setCurrentChannel] = useState<number>(-1); // definir le channel en cours by ID


  const socketChat = useContext(SocketContextChat);
  const {logged, setLogged} = useContext(LoggedContext);

  const setterCurrentChannel = (newIdChannel: number) => {
    console.log('helloSetter')
    setCurrentChannel(newIdChannel);
  }

  if(socketChat?.disconnected) 
  { 
    console.log(`Chat WS is connected in ChatMaster`);
    socketChat.auth = { type: `Bearer`, token: `${token}` };
    socketChat.connect();
  }

  async function updateMessages(channelID: number) {
    try {
      if (currentChannel != -1)
      {
        // console.log('***********try update messages?************')
        const messages = await apiReq.getApi.getAllMessagesChannel(channelID);
        setMessagesChannel(messages.data);
      }
    }
    catch (error){}

  }

  const newMessageHandler = (socket: Socket,
    setMessages: React.Dispatch<React.SetStateAction<messageDTO.IReceivedMessageEventDTO[]>>,
    currentChannel: number,
    message: messageDTO.IReceivedMessageEventDTO) => {
    if (message.channelID === currentChannel)
      setMessages(prevMessages => [...prevMessages, message]);
  }


  useEffect(() => {
    setTimeout(() => 
    {
      updateMessages(currentChannel);
    }, timeoutRefreshMessage)
    
    const messageHandler = (message: messageDTO.IReceivedMessageEventDTO) => {
      if (socketChat?.connected)
        newMessageHandler(socketChat, setMessagesChannel, currentChannel, message);
    };
  
    if (socketChat) {
      socketChat.on(wsChatRoutesBack.sendMsg(), messageHandler);
    }
    
    return () => {
      if (socketChat) {
        socketChat.off(wsChatRoutesBack.sendMsg(), messageHandler);
      }
    };
  }, [currentChannel]);


  useEffect(() => {

      if (socketChat){
        wsChatListen.infoRoom(socketChat); //DBG
        wsChatListen.createRoomListen(socketChat, setChannels);
        wsChatListen.updateChannelsJoined(socketChat, setChannels);
        //TODO: update channelsServer
        wsChatEvents.pingUpdateChannelsJoined(socketChat);
      }
      else {

      }
  
    return (() => {
      socketChat?.off();
      socketChat?.disconnect();
    })
  }, [])


  useEffect(() => {
    // console.log(`CHANNELS UPDATED =  ${JSON.stringify(channels)}`);
    if (socketChat){
      wsChatListen.channelHasChanged(socketChat, channels, setChannels)
    }

    return (() => {
    if (socketChat){
      wsChatListen.channelHasChangedOFF(socketChat, channels, setChannels)
    }
    })
  }, [channels])
  
  return (
    <div className={`${className}`}>
      {socketChat?.active ? 
        <ChatChannelList  className={'chat_channel_block'}
                          socket={socketChat}
                          channels={channels}
                          setCurrentChannel={setterCurrentChannel}
                          currentChannel={currentChannel}
                          channelsServer={channelsServer}
                          isServerList={false} /> : <></> }
      
      <div className='chat_block_main'>
        <ChatMessagesList className='chat_message_list' messages={messagesChannel} currentChannel={currentChannel} userCurrentID={userID}/> {/* TODO: charger ref liste message channel en cours*/}
        {socketChat?.active ? 
        <ChatInput className={'chat_block_messages_input'} socket={socketChat} channelID={currentChannel} /> : <></>}
      </div>
    </div>
  )
}
