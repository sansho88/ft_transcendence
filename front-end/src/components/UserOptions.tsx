import React, {useContext, useEffect, useState} from "react";
import {EStatus, IUser} from "@/shared/types";
import Button from "@/components/CustomButtonComponent";
import {UserContext, SocketContextChat, SocketContextGame} from "@/context/globalContext";
import * as apiReq from '@/components/api/ApiReq'
import {NotificationManager} from 'react-notifications';
import { wsChatEvents, wsGameEvents } from "./api/WsReq";
import { EGameMod, IChallengeStepDTO } from "@/shared/typesGame";
import { channelsDTO } from "@/shared/DTO/InterfaceDTO";
import PutDuration, { DurationType } from "./chat/subComponents/PutDuration";


export interface userOptionsProps {
   user: IUser;
   showAdminOptions?: boolean;
   relationships: {followed:IUser[], blocked?:IUser[]};
   channelID?: number;
   banID?: number;
   muteID?: number;
   adminID?: number;
   setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserOptions: React.FC<userOptionsProps> = ({classname, idProperty, user, showAdminOptions, relationships, channelID, setRefresh, banID, muteID, adminID}) => {
    const {userContext} = useContext(UserContext);
    const [isFollowed, setIsFollowed] = useState(relationships.followed && !!relationships.followed.find(tmpUser => user.UserID === tmpUser.UserID));
    const [isBlocked, setIsBlocked] = useState(relationships.blocked && !!relationships.blocked.find(tmpUser => user.UserID == tmpUser.UserID));
    const [isWaitingChallenge, setIsWaitingChallenge] = useState<boolean>(false);
    const [isDurationVisible, setIsDurationVisible] = useState<boolean>(false);
    const [durType, setDurationType] = useState<typeof DurationType[keyof typeof DurationType]>(DurationType.Ban);
    const [showPopupAdmin, setShowPopupAdmin] = useState<boolean>(false);

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
            wsGameEvents.createChallenge(socketRefGame, tmp)
        }
    }

    function handleKick() {
        if (!showAdminOptions || channelID === undefined) return NotificationManager.error(`You can\'t kick ${user.nickname} (${user.login})`);
        apiReq.putApi.putKickUser(channelID, user.UserID)
            .then(() => {
                NotificationManager.success(`You kicked ${user.nickname} (${user.login})`);
                setRefresh(true);
            })
            .catch(() => {
                NotificationManager.error(`You can\'t kick ${user.nickname} (${user.login})`);
            })
    }

    function handleBan() {
        if (!showAdminOptions || channelID === undefined) return NotificationManager.error(`You can\'t ban ${user.nickname} (${user.login})`);
        if (banID === undefined) {
            setDurationType(DurationType.Ban);
            setIsDurationVisible(!isDurationVisible);
        }
        else {
            apiReq.putApi.putUnbanUser(banID)
                .then(() => {
                    NotificationManager.success(`You unbanned ${user.nickname} (${user.login})`);
                    setRefresh(true);
                })
                .catch(() => {
                    NotificationManager.error(`You can\'t unban ${user.nickname} (${user.login})`);
                })
        }
    }

    function handleMute() {
        if (!showAdminOptions || channelID === undefined) return NotificationManager.error(`You can\'t mute ${user.nickname} (${user.login})`);
        if (muteID === undefined) {
            setDurationType(DurationType.Mute);
            setIsDurationVisible(!isDurationVisible);
        }
        else {
            apiReq.putApi.putUnmuteUser(muteID ? muteID : -1)
                .then(() => {
                    NotificationManager.success(`You unmuted ${user.nickname} (${user.login})`);
                    setRefresh(true);
                })
                .catch(() => {
                   NotificationManager.error(`You can\'t unmute ${user.nickname} (${user.login})`);
                })
        }
    }

    const adminOptionsSettings = () => {
        return (
            <div  id={"adminOptionsSettings"} style={{marginTop:"10px"}}>
                <Button image={`/block-message-${muteID === undefined ? "red" : "green"}.svg`} onClick={() => {handleMute()}} alt={"Mute"} margin={"0 5px 0 0"} title={`${muteID != undefined && "Un" || ""}Mute`}/>
                <Button image={"/door-red.svg"} onClick={() => {handleKick()}} alt={"Kick"} margin={"0 5px 0 0"} title={"Kick"}/>
                <Button image={`/hammer-${banID === undefined ? "red" : "green"}.svg`} onClick={() => {handleBan()}}  alt={"Ban"} title={`${banID !== undefined && "Un" || ""}Ban`}/>
                <Button image={`/${adminID === undefined ? "pro" : "de"}mote.svg`} onClick={() => {handleGrant()}} alt={"Grant"} title={`${adminID === undefined ? "Pro" : "De"}mote`}/>
            </div>
        )
    }
    function handleGrant() {
        if (!showAdminOptions || channelID === undefined) return NotificationManager.error(`You can\'t grant ${user.nickname} (${user.login})`);
        if (adminID === undefined) {
            apiReq.putApi.putGrantAdmin(channelID, user.UserID)
                .then(() => {
                    NotificationManager.success(`You granted ${user.nickname} (${user.login})`);
                    setRefresh(true);
                })
                .catch(() => {
                    NotificationManager.error(`You can\'t grant ${user.nickname} (${user.login})`);
                })
        }
        else {
            apiReq.putApi.putRevokeAdmin(channelID, user.UserID)
                .then(() => {
                    NotificationManager.success(`You revoked ${user.nickname} (${user.login})`);
                    setRefresh(true);
                })
                .catch(() => {
                    NotificationManager.error(`You can\'t revoke ${user.nickname} (${user.login})`);
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

                        { !isWaitingChallenge && user.status != EStatus.Offline &&
                            <>
                                <Button image={"/sword.svg"} onClick={() => handleChallenge(EGameMod.classic)} alt={"Challenge"} title={"Classic Challenge"}/>
                                <Button image={"/swordGhost.svg"} onClick={() => handleChallenge(EGameMod.ghost)} alt={"Challenge"} title={"Ghost Challenge"}/>
                            </>
                        }

                        {showAdminOptions && <Button image={"/slavery-whip.svg"} onClick={() => setShowPopupAdmin(!showPopupAdmin)} alt={"Admin window"} title={"Admin window"}/>}

                        {showAdminOptions && showPopupAdmin && adminOptionsSettings()}


                    </span>
                    {isDurationVisible && <PutDuration 
                    user={user} 
                    channelID={channelID} 
                    handleType={durType} 
                    isVisible={isDurationVisible && showPopupAdmin}
                    setDurationType={setDurationType}
                    setIsDurationVisible={setIsDurationVisible}
                    setRefresh={setRefresh}
                    />}
                </div>}
        </>
    )

};

export  default  UserOptions;