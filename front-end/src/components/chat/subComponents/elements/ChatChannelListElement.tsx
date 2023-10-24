'use client'

import React, {useEffect, useRef, useState} from 'react'
import {v4 as uuidv4} from "uuid";
import Button from "@/components/CustomButtonComponent";
import Image from "next/image";
import { channelsDTO } from '@/shared/DTO/InterfaceDTO';
import { wsChatEvents } from '@/components/api/WsReq';
import LeaveChannelCross from './LeaveChannelCross';

import ChatMaster from '../../ChatMaster';
import { Socket } from 'socket.io-client';
import { IUser } from '@/shared/types';
import * as apiReq from '@/components/api/ApiReq'
import AddUserPrivateChannel from './AddUserPrivateChannel';
import { Fascinate } from 'next/font/google';



export default function ChatChannelListElement({socket, channelID, channelName, onClickFunction, isInvite, currentChannel, isMp, isProtected, isServList, isOwner, isPending, inviteID}: {
    socket: Socket,
    channelID: number,
    channelName: string,
    onClickFunction: Function,
    isInvite: boolean,
    currentChannel: number,
    isMp: boolean,
    isProtected: boolean,
    isServList: boolean,
    isOwner: boolean,
    isPending: boolean,
    inviteID: number
}) {
    // const [isPending, setIsPending] = useState(false); //TODO: check si cest une invit ?

    const [channelPassword, setChannelPassword] = useState("");
    const [channelType, setChannelType] = useState("");
    const [areSettingsValids, setSettingsValid] = useState(false);
    const [showPassword, setPasswordVisible] = useState("password");
    const [passwordErrorMsg, setPasswordErrMsg] = useState("");
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [actualUserID, setActualUserID] = useState<number>(-1)
    const [channelMpName, setChannelMpName] = useState<string | null>(null)
    const [usersList, setUsersList] = useState<IUser[]>([]);
    // const [inviteID, setInviteID] = useState<number>(0);


    async function getUserId(){
        
        
        await apiReq.getApi.getMeUser()
            .then((res) => {

                setActualUserID(res.data.UserID);
                return apiReq.getApi.getAllUsersFromChannel(channelID, new Date)
            })
            .then((res) => {
                setUsersList(res.data);
            })
    }


    useEffect(() => {
        if (isMp)
            getUserId();
        
        console.log('invite ChannelID IN ELEMENT = ', inviteID)

    }, [])


    useEffect(() => {
        if(isMp) {
            const friendMpIndex: number = usersList.findIndex((user) => user.UserID !== actualUserID)
            if (friendMpIndex != -1)
                setChannelMpName(usersList[friendMpIndex].login)
        }
    }, [usersList])




useEffect(() => {
    if (channelPassword.length > 2) {
        setSettingsValid(true);
    } else {
        setSettingsValid(false);
    }

}, [channelName, channelType, channelPassword]);

    function handleAcceptInvite() {
        // console.log(`Invite to ${channelName} accepted`);
        // setIsPending(false);
        onClickSwitcher();
    }

    const [visible, setVisible] = useState<boolean>(true);
    function handleDeclineInvite() {
        // console.log(`Invite to ${channelName} declined`);
        setVisible(false);
        apiReq.putApi.inviteIdRemove(inviteID)
        .then((res) => {
            if(res.status === 200)
                return;
        }) 
    }


    function handleOnPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setChannelPassword(value);

        if (value.length < 3 || value.length > 12) {
            setPasswordErrMsg("min. 3 characters");
        }
        else if (!/^[A-Za-z0-9_]+$/.test(value)) {
            setPasswordErrMsg("Alphanumerics only");
        }
        else
            setPasswordErrMsg("");
    }

    function handleShowPassword(event){
        event.preventDefault();
        setPasswordVisible(showPassword == "text" ? "password" : "text");
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (areSettingsValids)
        {
            // console.log(`${channelType} channel ${channelName} created ${channelType == "Protected" ? `password: ${channelPassword}` : ""}`);
            // setIsChannelCreated(true);
            
            // const newChannel: channelsDTO.IJoinChannelDTOPipe = {
            //     channelID: channelID,
            //     password: channelType === "Protected" ? channelPassword : undefined
            //   }
            
            onClickFunction(channelPassword);
          }
        
    }


    function onClickSwitcher() {

        if(isProtected === true) {
            if(areSettingsValids)
                onClickFunction(channelPassword);
        }
        else
            onClickFunction();
    }

    const defineClassName = useRef<string>('chat_channel_list_element')
    useEffect(() => {
        if (isMp)
        {
            if (currentChannel === channelID)
                defineClassName.current = ' chat_channel_list_element\
                                            chat_channel_list_element_mp \
                                            chat_channel_list_element_selected';
            else 
                defineClassName.current = ' chat_channel_list_element \
                                            chat_channel_list_element_mp';
        }
        else if (isOwner)
        {
            if (currentChannel === channelID)
                defineClassName.current = ' chat_channel_list_element\
                                            chat_channel_list_element_owner \
                                            chat_channel_list_element_selected';
            else 
                defineClassName.current = ' chat_channel_list_element \
                                            chat_channel_list_element_owner' ;
        }
        else 
        {
            if (currentChannel === channelID)
                defineClassName.current = ' chat_channel_list_element \
                                            chat_channel_list_element_selected';
            else 
                defineClassName.current = ' chat_channel_list_element';
        } 
		}, [currentChannel]);


        
        function leaveChan(socket: Socket, channelLeaveID: number) {
            const leavedChannel: channelsDTO.ILeaveChannelDTOPipe = {channelID: channelLeaveID}
            console.log('leave action')
            wsChatEvents.leaveRoom(socket, leavedChannel)
        }
    
        const timerRef = useRef(null);
        const handleMouseEnter = () => {
        //   clearTimeout(timerRef.current); // Annule tout timer existant
          setIsHovered(true);
        };
      
        const handleMouseLeave = () => {
          // Défini un timer pour retarder le changement d'état
        //   timerRef.current = setTimeout(() => {
            setIsHovered(false);
        //   }, 300); // 100 ms de délai
        };

    return (
        <>
        {visible && 
        <div    onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={currentChannel === channelID ? `channel channel_selected ` : `channel `}>
            <div key={`button_channel_${uuidv4()}`}
                 className={`${defineClassName.current} justify-between ${channelName.length <= 10 ? 'flex' : 'flex-col'}`} onClick={() => onClickSwitcher()}>
                    <div className={`flex truncate ${channelName.length <= 10 ? '' : ' text-xs'}`} >{channelMpName === null ? channelName : channelMpName}</div>
                    {isInvite && isHovered && <AddUserPrivateChannel className='' currentChannel={currentChannel} channelID={channelID}/>}
                    {!isServList && !isMp && isHovered && <LeaveChannelCross className={`flex-shrink-0 text-red-800 z-0`} onClickFunction={() => leaveChan(socket, channelID)} />}

            {isPending && 
            <div id={"invite_options"} className='flex space-x-2 mr-2'>
                <span  onClick={ (event) => {
                    event.stopPropagation()
                    handleAcceptInvite()} }>✅</span>
                <div className='z-0' onClick={ (event) => {
                    event.stopPropagation();
                    handleDeclineInvite()} }>❌</div>
            </div>}
            </div>
            {isProtected && 
                <div>
                          <li><label>
                                    <input id={"channelPasswordInput"}
                                           type={showPassword}
                                           inputMode={"text"}
                                           minLength={3}
                                           maxLength={12}
                                           value={channelPassword}
                                           placeholder={" Password"}
                                           autoFocus={true}
                                           onChange={handleOnPasswordChange}/>
                                    <Button id={"button_showPassword"} image={showPassword == "password" ? "/eye-off.svg" : "/eye-show.svg"}
                                            onClick={handleShowPassword}
                                            alt={"Show password button"}/>
                                    <p style={{fontSize: "12px", color: "red"}}>{passwordErrorMsg}</p>
                                </label></li>
                                 <button onClick={onClickSwitcher} disabled={!areSettingsValids}>
                                    {areSettingsValids && <Image
                                    src="/confirm.svg"
                                    alt="add new channel button"
                                    width={32}
                                    height={32}
                                    disabled={channelType.length == 0}
                                />}
                            </button>
                </div>
            }
        </div>
        }
        </>

    )
}

