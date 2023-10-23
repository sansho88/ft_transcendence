import React, {useContext, useEffect, useState} from "react";
import {EStatus, IUser} from "@/shared/types";
import Button from "@/components/CustomButtonComponent";
import {UserContext, SocketContextChat, SocketContextGame} from "@/context/globalContext";
import * as apiReq from '@/components/api/ApiReq'
import {NotificationManager} from 'react-notifications';
import { wsChatRoutesBack } from "@/shared/routesApi";
import { wsChatEvents, wsGameEvents } from "./api/WsReq";
import { Socket } from "socket.io-client";
import { EGameMod, EStatusFrontGame, IChallengeStepDTO } from "@/shared/typesGame";
import { channelsDTO } from "@/shared/DTO/InterfaceDTO";
import { IChannel } from "@/shared/typesChannel";
import PutDuration, { DurationType } from "./chat/subComponents/PutDuration";


export interface userOptionsProps {
   user: IUser;
   showAdminOptions?: boolean;
   relationships: {followed:IUser[], blocked?:IUser[]};
   channelID?: number;
   banID?: number;
   muteID?: number;
   setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserOptions: React.FC<userOptionsProps> = ({classname, idProperty, user, showAdminOptions, relationships, channelID, setRefresh, banID, muteID}) => {
    const {userContext, setUserContext} = useContext(UserContext);
    const [isFollowed, setIsFollowed] = useState(!!relationships.followed.find(tmpUser => user.UserID == tmpUser.UserID));
    const [isBlocked, setIsBlocked] = useState(relationships.blocked && !!relationships.blocked.find(tmpUser => user.UserID == tmpUser.UserID));
    const [isWaitingChallenge, setIsWaitingChallenge] = useState<boolean>(false);
    const [isDurationVisible, setIsDurationVisible] = useState<boolean>(false);
    const [durType, setDurationType] = useState<typeof DurationType[keyof typeof DurationType]>(DurationType.Ban);

    const socketRef = useContext(SocketContextChat)
    const socketRefGame = useContext(SocketContextGame)

    function handleFollow(){
        if (!isFollowed)
        {
            apiReq.putApi.followUser(user.UserID)
                .then(() =>{
                    NotificationManager.success(`You are now following ${user.nickname} (${user.login})`);
                    setIsFollowed(!isFollowed);
                })
                .catch(() => {
                    NotificationManager.error(`You can\'t follow ${user.nickname} (${user.login})`);
                });
        }
        else
        {
            apiReq.putApi.unfollowUser(user.UserID)
                .then(() => {
                    NotificationManager.success(`You don\'t follow ${user.nickname} (${user.login}) anymore.`);
                    setIsFollowed(!isFollowed);
                })
                .catch(() => {
                    NotificationManager.error(`You can\'t unfollow ${user.nickname} (${user.login})`);
                });
        }
    }
    
    function handleBlock(){
        if (!isBlocked)
        {
            apiReq.putApi.blockUser(user.UserID)
                .then(() =>{
                    NotificationManager.success(`You are now blocking ${user.nickname} (${user.login})`);
                    setIsBlocked(!isBlocked);
                })
                .catch(() => {
                    NotificationManager.error(`You can\'t block ${user.nickname} (${user.login})`);
                });
        }
        else
        {
            apiReq.putApi.unblockUser(user.UserID)
                .then(() => {
                    NotificationManager.success(`You don\'t block ${user.nickname} (${user.login}) anymore.`);
                    setIsBlocked(!isBlocked);
                })
                .catch(() => {
                    NotificationManager.error(`You can\'t unblock ${user.nickname} (${user.login})`);
                });
        }
    }

    function handleMp() {
        if (socketRef)
            wsChatEvents.createMP(socketRef, { targetID: user.UserID });
    }
        
    function handleChallenge(gameMod: EGameMod) {
        if (socketRefGame){
            setIsWaitingChallenge(true);
            const tmp: channelsDTO.ICreateChallengeDTO = {targetID: user.UserID, gameMod: gameMod}
            wsGameEvents.createChallenge(socketRefGame, tmp) //TODO: pouvoir choisir le gameMod
        }
    }

    function handleKick() {
        if (!showAdminOptions || channelID === undefined) return console.log('NO RIGHTS TO DO THIS ACTION');
        apiReq.putApi.putKickUser(channelID, user.UserID)
            .then(() => {
                console.log('KICK SUCCESS')
                setRefresh(true);
            })
            .catch(() => {
                console.log('KICK FAILED')
            })
    }

    function handleBan() {
        if (!showAdminOptions || channelID === undefined) return console.log('NO RIGHTS TO DO THIS ACTION');
        if (banID === undefined) {
            setDurationType(DurationType.Ban);
            setIsDurationVisible(!isDurationVisible);
        }
        else {
            apiReq.putApi.putUnbanUser(banID)
                .then(() => {
                    console.log('UNBAN SUCCESS')
                    setRefresh(true);
                })
                .catch(() => {
                    console.log('UNBAN FAILED')
                })
        }
    }

    function handleMute() {
        if (!showAdminOptions || channelID === undefined) return console.log('NO RIGHTS TO DO THIS ACTION');
        if (muteID === undefined) {
            setDurationType(DurationType.Mute);
            setIsDurationVisible(!isDurationVisible);
        }
        else {
            apiReq.putApi.putUnmuteUser(muteID ? muteID : -1)
                .then(() => {
                    console.log('UNMUTE SUCCESS')
                    setRefresh(true);
                })
                .catch(() => {
                    console.log('UNMUTE FAILED')
                })
        }
    }


    useEffect(() => {
        if (socketRefGame){
            socketRefGame.on('challengeStep', (res: IChallengeStepDTO) => {
                if (!res.challengerequested)
                    setIsWaitingChallenge(false);
            })
        }
        }, [])
    

    return (
        <>
            {userContext.UserID != user.UserID &&
                <div className={classname} id={idProperty} style={{marginTop:"10px"}}>
                    <span >
                        {!isFollowed ? <Button image={"/add-user.svg"} onClick={handleFollow} alt={"Follow"}  title={"Follow"}/>
                        : <Button image={"/remove-user.svg"} onClick={handleFollow} alt={"Unfollow"} title={"Unfollow"}/>}

                        {!isBlocked ? <Button image={"/block.svg"} onClick={handleBlock} alt={"Block"} title={"Block"}/>
                        : <Button image={"/accept.svg"} onClick={handleBlock} alt={"Block"} margin={"0 5px 0 0"} title={"Unblock"}/>}

                        <Button image={"/send-message.svg"} onClick={handleMp} alt={"Send MP"} title={"MP"}/>

                        {showAdminOptions &&
                            <span style={{float:"right"}}>
                                {muteID === undefined ? <Button image={"/block-message.svg"} onClick={() => {handleMute()}} alt={"Mute"} margin={"0 5px 0 0"} title={"Mute"} color="red"/>
                                : <Button image={"/block-message.svg"}                       onClick={() => {handleMute()}} alt={"UnMute"} margin={"0 5px 0 0"} title={"UnMute"} color="green"/>}
                                <Button image={"/door.svg"}                                  onClick={() => {handleKick()}} alt={"Kick"} margin={"0 5px 0 0"} title={"Kick"} color="red"/>
                                {banID === undefined ? <Button image={"/hammer.svg"}         onClick={() => {handleBan()}}  alt={"Ban"} title={"Ban"}/>
                                : <Button image={"/hammer.svg"}                              onClick={() => {handleBan()}}  alt={"Unban"} margin={"0 5px 0 0"} title={"Unban"} color="green"/>}
                            </span>
                        }
                        { !isWaitingChallenge && user.status != EStatus.Offline &&
                            <>
                                <Button image={"/sword.svg"} onClick={() => handleChallenge(EGameMod.classic)} alt={"Challenge"} title={"Classic Challenge"}/>
                                <Button image={"/swordGhost.svg"} onClick={() => handleChallenge(EGameMod.ghost)} alt={"Challenge"} title={"Ghost Challenge"}/>
                            </>
                        }
                    </span>
                    {isDurationVisible && <PutDuration 
                    user={user} 
                    channelID={channelID} 
                    handleType={durType} 
                    isVisible={isDurationVisible}
                    setDurationType={setDurationType}
                    setIsDurationVisible={setIsDurationVisible}
                    setRefresh={setRefresh}
                    />}
                </div>}
        </>
    )

};

export  default  UserOptions;