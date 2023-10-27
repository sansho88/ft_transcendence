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
  const [messagesChannel, setMessagesChannel] = useState<messageDTO.IReceivedMessageEventDTO[]>([]) //les messages actuellement load du channel
  const [currentChannel, setCurrentChannel] = useState<number>(-1); // definir le channel en cours by ID
  const [blockList, setBlockList] = useState<IUserEntity[]>([]); // definir le channel en cours by ID
  const newChanIsMp = useRef<boolean>(false); // fix refresh des message si mp
  const lastChanPing = useRef<number>(-1)
  
  const chanRef = useRef<number>(-1); 
  
  const socketChat = useContext(SocketContextChat);

  const setterCurrentChannel = (newIdChannel: number) => {
    setCurrentChannel(newIdChannel);
  }

  if(socketChat?.disconnected) 
  { 
    if (!token){
      const tokentmp = localStorage.getItem('token');
      if (tokentmp)
        token = tokentmp;
    }
    socketChat.auth = { type: `Bearer`, token: `${token}` };
    socketChat.connect();
  }

  function checkMessageBlockedList(message: any, blockList):boolean {
    return !blockList.some((user) => user.UserID === message.author.UserID);
  }

  async function updateBlockList() {
    
    await apiReq.getApi.getBlockedList()
    .then((res: {data: IUserEntity[]}) => {
      setBlockList(res.data)
    })
    .catch(() => {})
  }


  async function updateMessages(channelID: number) {
        await apiReq.getApi.getAllMessagesChannel(channelID)
        .then(async (messages) => {
          const lst = await apiReq.getApi.getBlockedList()
          .then((res: {data: IUserEntity[]}) => {
            setBlockList(res.data)
            return res.data
          })
          .catch(() => {})
          const tmpMessages = messages.data.filter((message) => checkMessageBlockedList(message, lst))
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
        if (checkMessageBlockedList(message, res.data) && message.channelID === currentChannel)
          setMessages(prevMessages => [...prevMessages, message]);
      })
      .catch(() => {})
  }

  function channelIdIsInListChannels(targetChanID: number): boolean {
    return channels.some((channel) => channel.channelID === targetChanID)
  }

  useLayoutEffect(() => {
    if(currentChannel !=  -1)
      chanRef.current = currentChannel;

    setTimeout(() => {
      if (channelIdIsInListChannels(currentChannel) === true)
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
        if(channelIdIsInListChannels(chanRef.current) === true)
          setCurrentChannel(chanRef.current);
        else
        {
          setCurrentChannel(-1);
        }
      },timeoutRefreshChannel)
  
  }

  useEffect(() => {

      if (socketChat){
        wsChatListen.createRoomListen(socketChat, setChannels, newChanIsMp);
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
    if (socketChat){
      wsChatListen.channelHasChanged(socketChat, channels, setChannels);
      wsChatListen.leaveRoomListen(socketChat, setChannels, setCurrentChannel, channels)
    }
    
    return (() => {
      if (socketChat){
        wsChatListen.channelHasChangedOFF(socketChat, channels, setChannels)
        wsChatListen.leaveRoomListenOFF(socketChat, setChannels, setCurrentChannel, channels)
    }
      refreshChannel();
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
        <ChatMessagesList className='chat_message_list' messages={messagesChannel} currentChannel={currentChannel} userCurrentID={userID}/>
        {socketChat?.active ? 
        <ChatInput className={'chat_block_messages_input'} socket={socketChat} channelID={currentChannel} /> : <></>}
      </div>
    </div>
  )
}
