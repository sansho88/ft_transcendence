'use client'

import React, {useState, useLayoutEffect, useEffect} from 'react'
import ChatChannelListElement from './elements/ChatChannelListElement'
import Image from "next/image";
import { wsChatEvents } from '@/components/api/WsReq';
import { Socket } from 'socket.io-client';
import { EChannelType, IChannel } from '@/shared/typesChannel';
import ChatNewChannelPopup from "@/components/chat/subComponents/ChatNewChannelPopup";
import SettingsChannel from "@/components/chat/subComponents/SettingsChannel";
import UserList from "@/components/UserListComponent";
import { channelsDTO } from '@/shared/DTO/InterfaceDTO';
import * as apiReq from '@/components/api/ApiReq'
import { IInviteEntity } from '@/shared/entities/IInvite.entity';
import { IChannelCredentialEntity } from '@/shared/entities/ICredential.entity';
import { IChannelInvite } from '@/shared/types';
import { IChannelEntity } from '@/shared/entities/IChannel.entity';


export default function ChatChannelList({className, socket, channels, setCurrentChannel, currentChannel, isServerList, channelsServer, userID}
  : { className: string, 
      socket: Socket, 
      channels: IChannel[], 
      channelsServer: IChannel[],
      setCurrentChannel: Function, 
      currentChannel: number, 
      isServerList: boolean,
      userID: number
    }) {

  const [isPopupChannelsVisible, setPopupChannelVisible] = useState(false);
  const [isPopupSettingsVisible, setPopupSettingsVisible] = useState(false);
  const [isPopupUsersVisible, setPopupUsersVisible] = useState(false);
  const actualChannel = channels.find(channel => channel.channelID === currentChannel);


function isOwner(): boolean {

    if (channels &&  channels.length > 0)
        {
          const tchan = channels.findIndex((channel) => channel.channelID === currentChannel)
          if (channels[tchan].type !== EChannelType.DIRECT)
            return channels[tchan].owner.UserID === userID
          else
            return false
        }
    return false
}
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
              width={22}
              height={22}
              style={{width: "80%", height:"auto", maxWidth:"4vw", maxHeight:"4vh"}}
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
                      style={{width: "80%", height:"auto", maxWidth:"4vw", maxHeight:"4vh"}}
                  />
                </button>
          { actualChannel && isPopupSettingsVisible &&  <SettingsChannel className={"chat_new_channel_popup"}
          socket={socket}
          channelToEdit={actualChannel}/> }

      </>
    )
  }
    const showUsersInChannel =  () => {
        return (
            <>
                {isPopupUsersVisible && <div id={"make_popup_disappear"} onClick={() => setPopupUsersVisible(false)}></div>}
                <button  onClick={() => {
                    setPopupUsersVisible(!isPopupUsersVisible);
                }}>

                </button>
                { actualChannel  && <UserList id={"chat_users_button"}
                                              userListIdProperty={"chat_users_list"}
                                              avatarSize={"medium"}
                                              usersList={`users_from_channel_${currentChannel}`}
                                              showUserProps={true}
                                              adminMode={isOwner()}
                                              channelID={currentChannel}
                /> }

            </>
        )
    }

    const [myInviteLst, setMyInviteLst] = useState<IInviteEntity[]>([])

    useLayoutEffect(() => {
      getChannelInvite();
    }, [])


    useEffect(() => {
      console.log('DBG invite lst ', JSON.stringify(myInviteLst)) // LE LOOOG
    }, [myInviteLst])
    
    
    function getChannelInvite(){
      apiReq.getApi.getMyInvite().then((res) => {
        setMyInviteLst(res.data)
      })
  

    }

    function isInvitable(channelID: number):boolean {
      if (myInviteLst.length > 0)
        return myInviteLst.some((channel) => channel.channel.channelID === channelID)
      return false

    }

    function defineInviteID(channelID: number):number {
      if (myInviteLst.length > 0)
      {
        const index: number = myInviteLst.findIndex((channel) => channel.channel.channelID === channelID)
        console.log('HEY INDEX ==== ' , index, ' ', isInvitable(channelID))
        if (index >= 0)
          return myInviteLst[index].inviteID
      }
      return -1;
    }


  return (

    <div className={`${className}`}>
      <div className={`chat_channel_list`}>
        {channels && !isServerList && 
          channels.map((channel) => (
            <ChatChannelListElement
              key={channel.channelID}
              channelID={channel.channelID}
              inviteID={-1}
              channelName={channel.name}
              isInvite={channel.type === EChannelType.PRIVATE} //TODO:
              isMp={channel.type === EChannelType.DIRECT} //TODO:
              socket={socket}
              isServList={false}
              isOwner={channel.owner ? channel.owner.UserID === userID : false }
              onClickFunction={() => {
                setCurrentChannel(channel.channelID);
              }}
              currentChannel={currentChannel}
              isProtected={false}
              isPending={false}
            />
          ))
        }
        {channelsServer && isServerList &&
          channelsServer.filter(channel => channel.type <= EChannelType.PROTECTED || (channel.type === EChannelType.PRIVATE && isInvitable(channel.channelID) === true) ) //FIXME:FIXME:
          .filter(channel => channels && !channels.some(existingChannel => existingChannel.channelID === channel.channelID)) 
          .map((channel) => (
            <ChatChannelListElement
              key={channel.channelID}
              channelID={channel.channelID}
              inviteID={defineInviteID(channel.channelID)}
              channelName={channel.name}
              isInvite={false} //TODO:
              isMp={false} //TODO:
              socket={socket}
              isServList={true}
              isOwner={false}
              isPending={channel.type === EChannelType.PRIVATE}
              onClickFunction={(password?: string) => {
                if (password != undefined){
                  if(channel.type === EChannelType.PROTECTED)
                  {
                    const joinChan: channelsDTO.IJoinChannelDTOPipe = {
                      channelID: channel.channelID,
                      password: password
                    }
                    wsChatEvents.joinRoom(socket, joinChan)

                    setPopupChannelVisible(false);
                  }
                }
                else {
                  wsChatEvents.joinRoom(socket, channel)
                  setCurrentChannel(channel.channelID);
                  setPopupChannelVisible(false);
                }
              }}
              currentChannel={currentChannel}
              isProtected={channel.type === EChannelType.PROTECTED}
            />
          ))
        }
      </div>
     {!isServerList &&
      <div className='chat_channel_buttons'>
          <span>{addChannel()}</span> <span style={{marginLeft:"10%"}}>{actualChannel?.owner.UserID == userID && actualChannel?.type !== EChannelType.DIRECT && paramChannel()}</span> <span>{showUsersInChannel()}</span>
      </div>}
    </div>
  )
}
