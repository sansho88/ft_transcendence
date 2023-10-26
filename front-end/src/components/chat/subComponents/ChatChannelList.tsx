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
  const [isAdmin, setIsAdmin] = useState(false);
  const actualChannel = channels.find(channel => channel.channelID === currentChannel);

useEffect(() => {
  if (actualChannel === undefined) return;
  apiReq.getApi.getAllAdminFromChannel(currentChannel).then((res) => {
    const adminList: channelsDTO.IAdminEntity[] = res.data;
    if (adminList && adminList.find(admin => admin.UserID === userID) !== undefined)
      setIsAdmin(true);
    else
      setIsAdmin(false);
  })
  .catch(() => {
    setIsAdmin(false);
  })
}, [actualChannel])

  const addChannel = () => {
    return (
      <>
          {isPopupChannelsVisible && <div id={"make_popup_disappear"} onClick={() => setPopupChannelVisible(false)}></div>}
        <button onClick={() => {setPopupChannelVisible(!isPopupChannelsVisible)
            if(isPopupSettingsVisible)
                setPopupSettingsVisible(false)
            if (isPopupUsersVisible)
                setPopupUsersVisible(false)
        }}>

          <Image
              src="/channel-add.svg"
              alt="ADD CHANNEL BUTTON"
              width={22}
              height={22}
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
                  if (isPopupUsersVisible)
                      setPopupUsersVisible(false)
                      }}>
                  <Image
                      src="/settings.svg"
                      alt="OPEN PARAMS BUTTON"
                      width={18}
                      height={18}
                      padding-right={"1px"}
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
                {isPopupUsersVisible && 
                <div id={"make_popup_disappear"} onClick={() => setPopupUsersVisible(false)}></div>}
                { actualChannel  && <UserList id={"chat_users_button"}
                                              userListIdProperty={"chat_users_list"}
                                              avatarSize={"medium"}
                                              usersList={`users_from_channel_${currentChannel}`}
                                              showUserProps={true}
                                              channelID={currentChannel}
                                              userID={userID}
                                              buttonVisibility={{setPopupChannelVisible, setPopupSettingsVisible, setPopupUsersVisible, isPopupChannelsVisible, isPopupSettingsVisible, isPopupUsersVisible}}
                /> }
            </>
        )
    }

    const [myInviteLst, setMyInviteLst] = useState<IInviteEntity[]>([])

    useLayoutEffect(() => {
      getChannelInvite();
    }, [])

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
              isInvite={channel.type === EChannelType.PRIVATE}
              isMp={channel.type === EChannelType.DIRECT}
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
          channelsServer.filter(channel => channel.type <= EChannelType.PROTECTED || (channel.type === EChannelType.PRIVATE && isInvitable(channel.channelID) === true) )
          .filter(channel => channels && !channels.some(existingChannel => existingChannel.channelID === channel.channelID)) 
          .map((channel) => (
            <ChatChannelListElement
              key={channel.channelID}
              channelID={channel.channelID}
              inviteID={defineInviteID(channel.channelID)}
              channelName={channel.name}
              isInvite={false}
              isMp={false}
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
              <span>{addChannel()}</span> <span>
                {actualChannel?.type !== EChannelType.DIRECT && actualChannel?.owner.UserID == userID && paramChannel()}</span>
              <span>{showUsersInChannel()}</span>
          </div>}
		</div>
	)
}
