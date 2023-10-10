'use client'

import React, { useEffect, useRef, useState } from 'react'
import ChatChannelListElement from './elements/ChatChannelListElement'
import Image from "next/image";
import { wsChatEvents, wsChatListen } from '@/components/api/WsReq';
import { Socket } from 'socket.io-client';
import { EChannelType, IChannel } from '@/shared/typesChannel';
import { channelsDTO } from '@/shared/DTO/InterfaceDTO';
import ChatNewChannelPopup from "@/components/chat/subComponents/ChatNewChannelPopup";


export default function ChatChannelList({className, socket, channels, setCurrentChannel, currentChannel, isServerList, channelsServer}
  : { className: string, 
      socket: Socket, 
      channels: IChannel[], 
      channelsServer: IChannel[],
      setCurrentChannel: Function, 
      currentChannel: number, 
      isServerList: boolean, 
    }) {

  const counterDBG = useRef<number>(0);

  const [isPopupVisible, setPopupVisible] = useState(false); 
  const addChannel = () => {
    return (
      <>
        <button onClick={() => setPopupVisible(!isPopupVisible)}>
        {/* <button onClick={() => action()}> for DBG action */}

          <Image
              src="/channel-add.svg"
              alt="ADD CHANNEL BUTTON"
              width={26}
              height={22}
              style={{ height: "auto", width: "auto"}}
              />
        </button>
    { isPopupVisible && <ChatNewChannelPopup 
                                      className={"chat_new_channel_popup"}
                                      socket={socket}
                                      channels={channels}
                                      currentChannel={currentChannel}
                                      setterCurrentChannel={setCurrentChannel}
                                      />}
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
    // console.log('HEY **************************' + JSON.stringify(channelsServer))
    // console.log('HEY **************************' + JSON.stringify(channels))
    
  }, [])

  useEffect(() => {
    console.log('chatChannelList: channels useEffect!')

  }, [channels])

  useEffect(() => {
    // console.log('ENFANNNNNNT ****** channelServer3 a changé : ', JSON.stringify(channelsServer));
    const newList = channelsServer.filter((channel) => channel.type === 2)
    // console.log('ENFANNNNNNT HEY 3**************************' + JSON.stringify(newList))




}, [channelsServer]);

  return (

    <div className={`${className}`}>
      <div className={`chat_channel_list`}>
        {/* <ChatChannelListElement channelID={1} channelName='#Channel 1' onClickFunction={setChannels(channel)} /> */}
        {/* <button onClick={() => setCurrentChannel(2)}> AHHH </button> */}
        {channels && isServerList === false &&
          channels.map((channel) => (
            <ChatChannelListElement
              key={channel.channelID}
              channelID={channel.channelID}
              channelName={channel.name}
              isInvite={false} //TODO:
              isMp={false} //TODO:
              onClickFunction={() => {
                setCurrentChannel(channel.channelID);
              }}
              currentChannel={currentChannel}
              isProtected={false}
            />
          ))
        }
        {/** Cas utilisation en tant que list pour JOIN un chan: */}
        {channelsServer && isServerList === true &&
          channelsServer
          .filter(channel => channel.type <= EChannelType.PROTECTED)
          .filter(channel => channels && !channels.some(existingChannel => existingChannel.channelID === channel.channelID)) 
          .map((channel) => (
            <ChatChannelListElement
              key={channel.channelID}
              channelID={channel.channelID}
              channelName={channel.name}
              isInvite={false} //TODO:
              isMp={false} //TODO:
              onClickFunction={(password?: string) => {
                if (password != undefined && password != null){
                  if(channel.type === EChannelType.PROTECTED)
                  {
                    const joinChan: channelsDTO.IJoinChannelDTOPipe = {
                      channelID: channel.channelID,
                      password: password
                    }
                    console.log('OUI CEST MOI : ' + JSON.stringify(password))
                    wsChatEvents.joinRoom(socket, joinChan)
                    
                    // setCurrentChannel(channel.channelID);
                    setPopupVisible(false);
                  }
                }
                else {
                  wsChatEvents.joinRoom(socket, channel)
                  setCurrentChannel(channel.channelID);
                  setPopupVisible(false);
                }
              }}
              currentChannel={currentChannel}
              isProtected={channel.type === EChannelType.PROTECTED}
            />
          ))
        }
      </div>
     {isServerList === false && 
      <div className='chat_channel_buttons'>
        {addChannel()} &nbsp; &nbsp; | &nbsp; &nbsp; {paramChannel()}
      </div>}
    </div>
  )
}
