'use client'

import React, { useContext, useEffect, useState, useRef, createContext, useLayoutEffect } from 'react'
import { LoggedContext, SocketContextChat, SocketContextGame, UserContext } from '@/context/globalContext'
import { IChannel } from '@/shared/typesChannel'
import ChatInput from './subComponents/ChatInput'
import ChatChannelList from './subComponents/ChatChannelList'
import ChatMessagesList from './subComponents/ChatMessagesList'
import { Socket } from 'socket.io-client'
import { IUser } from '@/shared/types'
import { wsChatEvents, wsChatListen } from '../api/WsReq'
import { IChannelEntity } from '@/shared/entities/IChannel.entity'
import { channel } from 'diagnostics_channel'
import * as apiReq from '../api/ApiReq'

import ChatNewChannelPopup from "@/components/chat/subComponents/ChatNewChannelPopup";
import { IMessageEntity } from '@/shared/entities/IMessage.entity'
import { channelsDTO, messageDTO } from '@/shared/DTO/InterfaceDTO'
import { wsChatRoutesBack } from '@/shared/routesApi'
import { IUserEntity } from '@/shared/entities/IUser.entity'


export default function ChatMaster({className, token, userID}: {className: string, token: string, userID: number}) {
  const timeoutRefreshMessage: number = 150; //ajoute un timeout pour laisser le temps au message de se charger
  const timeoutRefreshChannel: number = 250; //ajoute un timeout pour laisser le temps au message de se recharger apres un blocked
  

  const [channelsServer, setChannelsServer] = useState<IChannel[]>([]) //recuperer tous les channels server
  const [channels, setChannels] = useState<IChannel[]>([]) //list des channels JOINED
  const [messagesChannel, setMessagesChannel] = useState<messageDTO.IReceivedMessageEventDTO[]>([]) //les messages actuellement load du channel //TODO: faire route ws avec ping et update
  const [currentChannel, setCurrentChannel] = useState<number>(-1); // definir le channel en cours by ID
  const [blockList, setBlockList] = useState<IUserEntity[]>([]); // definir le channel en cours by ID
  
  const chanRef = useRef<number>(-1); 
  
  const socketChat = useContext(SocketContextChat);

  const setterCurrentChannel = (newIdChannel: number) => {
    setCurrentChannel(newIdChannel);
  }

  if(socketChat?.disconnected) 
  { 
    // console.log(`Chat WS is connected in ChatMaster`);
    if (!token){
      const tokentmp = localStorage.getItem('token');
      if (tokentmp)
        token = tokentmp;
    }
    socketChat.auth = { type: `Bearer`, token: `${token}` };
    socketChat.connect();
  }

  function checkMessageBlockedList(message: messageDTO.IReceivedMessageEventDTO):boolean {
    return !blockList.some((user) => user.UserID === message.author.UserID);
  }

  async function updateBlockList() {
    
    await apiReq.getApi.getBlockedList()
    .then((res: {data: IUserEntity[]}) => {
      setBlockList(res.data)
      console.log('res = ', JSON.stringify(res.data))
      console.log('update block list= ', JSON.stringify(blockList))
    })
    .catch(() => {})
  }


  async function updateMessages(channelID: number) {
        //get la liste des userBlocked
        console.log('update Des Messages')
        await apiReq.getApi.getAllMessagesChannel(channelID)
        .then(async (messages) => {
          await apiReq.getApi.getBlockedList()
          .then((res: {data: IUserEntity[]}) => {
            setBlockList(res.data)
          console.log('update block list= ', JSON.stringify(blockList))

          })
          .catch(() => {})
          const tmpMessages = messages.data.filter((message) => checkMessageBlockedList(message))
          setMessagesChannel(tmpMessages)
        })
        .catch(() => {})
  }

  const newMessageHandler = async (socket: Socket,
    setMessages: React.Dispatch<React.SetStateAction<messageDTO.IReceivedMessageEventDTO[]>>,
    currentChannel: number,
    message: messageDTO.IReceivedMessageEventDTO) => {
      await apiReq.getApi.getBlockedList()
      .then((res: {data: IUserEntity[]}) => {
        setBlockList(res.data)
        console.log('*********res data = ', JSON.stringify(res.data));
        if (checkMessageBlockedList(message) && message.channelID === currentChannel)
        setMessages(prevMessages => [...prevMessages, message]);
      })
      .catch(() => {})
   
  }



  useLayoutEffect(() => {
    console.log('current channel ', currentChannel)
    if(currentChannel !=  -1)
      chanRef.current = currentChannel;

    setTimeout(() => {
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


  function refreshChannel() {
      setCurrentChannel(-1);
      setMessagesChannel([]);

      setTimeout(() => {
        setCurrentChannel(chanRef.current);
      },timeoutRefreshChannel)
  
  }

  useEffect(() => {

      if (socketChat){
        wsChatListen.infoRoom(socketChat); //DBG
        wsChatListen.createRoomListen(socketChat, setChannels);
        wsChatListen.updateChannelsJoined(socketChat, setChannels);
        wsChatEvents.pingUpdateChannelsJoined(socketChat);
        wsChatListen.toggleBlockedUserList(socketChat, refreshChannel)
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
      wsChatListen.channelHasChanged(socketChat, channels, setChannels);
      wsChatListen.leaveRoomListen(socketChat, setChannels, setCurrentChannel, channels)
    }
    
    return (() => {
      if (socketChat){
        wsChatListen.channelHasChangedOFF(socketChat, channels, setChannels)
        wsChatListen.leaveRoomListenOFF(socketChat, setChannels, setCurrentChannel, channels)
    }
    // if(channels.length === 0)
      setMessagesChannel([])
    })
  }, [channels])
  
  return (
    <div className={`${className}`}>
      {socketChat?.active ? 
        <ChatChannelList  className={'chat_channel_block'}
                          userID={userID}
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
