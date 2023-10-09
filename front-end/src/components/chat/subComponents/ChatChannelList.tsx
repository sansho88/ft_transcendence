'use client'

import React, {useEffect, useRef, useState} from 'react'
import ChatChannelListElement from './elements/ChatChannelListElement'
import Image from "next/image";
import { wsChatEvents } from '@/components/api/WsReq';
import { Socket } from 'socket.io-client';
import { EChannelType, IChannel } from '@/shared/typesChannel';
import ChatNewChannelPopup from "@/components/chat/subComponents/ChatNewChannelPopup";
import SettingsChannel from "@/components/chat/subComponents/SettingsChannel";


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

  const [isPopupChannelsVisible, setPopupChannelVisible] = useState(false);
  const [isPopupSettingsVisible, setPopupSettingsVisible] = useState(false);

  const addChannel = () => {
    return (
      <>
          {isPopupChannelsVisible && <div id={"make_popup_disappear"} onClick={() => setPopupChannelVisible(false)}></div>}
        <button onClick={() => {setPopupChannelVisible(!isPopupChannelsVisible)
            if(isPopupSettingsVisible)
                setPopupSettingsVisible(false)
        }}>

          <Image
              src="/channel-add.svg"
              alt="ADD CHANNEL BUTTON"
              width={26}
              height={22}
              style={{ height: "auto", width: "auto"}}
              />
        </button>
    { isPopupChannelsVisible && <ChatNewChannelPopup
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
      const actualChannel = channels.find(channel => channel.channelID === currentChannel);

    return (
      <>
          {isPopupSettingsVisible && <div id={"make_popup_disappear"} onClick={() => setPopupSettingsVisible(false)}></div>}
              <button  onClick={() => {
                  setPopupSettingsVisible(!isPopupSettingsVisible);
                  if(isPopupChannelsVisible)
                      setPopupChannelVisible(false)
                      }}>
                  <Image
                      src="/settings.svg"
                      alt="OPEN PARAMS BUTTON"
                      width={18}
                      height={18}
                  />
                </button>
          { actualChannel && isPopupSettingsVisible &&  <SettingsChannel className={"chat_new_channel_popup"}
          socket={socket}
          channelToEdit={actualChannel}/> }

      </>
    )
  }
  
  useEffect(() => {
    console.log('HEY **************************' + JSON.stringify(channelsServer))
    console.log('HEY **************************' + JSON.stringify(channels))
  }, [])

  useEffect(() => {
    console.log('chatChannelList: channels useEffect!')

  }, [channels])

  return (

    <div className={`${className}`}>
      <div className={`chat_channel_list`}>
        {channels && !isServerList &&
          channels.map((channel) => (
            <ChatChannelListElement
              key={channel.channelID}
              channelID={channel.channelID}
              channelName={channel.name}
              isInvite={false} //TODO:
              isMp={false} //TODO:
              f={() => {
                setCurrentChannel(channel.channelID);
              }}
              currentChannel={currentChannel}
            />
          ))
        }
        {channelsServer && isServerList &&
          channelsServer
          .filter(channel => channel.type <= EChannelType.PROTECTED)//FIXME: et bah ca marche po !
          .filter(channel => channels && !channels.some(existingChannel => existingChannel.channelID === channel.channelID)) 
          .map((channel) => (
            <ChatChannelListElement
              key={channel.channelID}
              channelID={channel.channelID}
              channelName={channel.name}
              isInvite={false} //TODO:
              isMp={false} //TODO:
              f={() => {
                wsChatEvents.joinRoom(socket, channel) //FIXME: differencier de la liste des channels dispo en serveur
                setCurrentChannel(channel.channelID); //TODO: ajouter new Channel
                setPopupSettingsVisible(false);
              }}
              currentChannel={currentChannel}
            />

          ))
        }
      </div>
     {!isServerList &&
      <div className='chat_channel_buttons'>
          <span>{addChannel()}</span>&nbsp; &nbsp; | &nbsp; &nbsp; <span>{paramChannel()}</span>
      </div>}
    </div>
  )
}
