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
   isOwner?: boolean;
   setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserOptions: React.FC<userOptionsProps> = ({classname, idProperty, user, showAdminOptions, relationships, channelID, setRefresh, banID, muteID, adminID, isOwner}) => {
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
        if (!showAdminOptions || channelID === undefined) return console.log('NO RIGHTS TO DO THIS ACTION');
        if (adminID === undefined) {
            apiReq.putApi.putGrantAdmin(channelID, user.UserID)
                .then(() => {
                    console.log('GRANT SUCCESS')
                    setRefresh(true);
                })
                .catch(() => {
                    console.log('GRANT FAILED')
                })
        }
        else {
            apiReq.putApi.putRevokeAdmin(channelID, user.UserID) //adminID === user.UserID
                .then(() => {
                    console.log('REVOKE SUCCESS')
                    setRefresh(true);
                })
                .catch(() => {
                    console.log('REVOKE FAILED')
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

                        <Button image={"/joystick.svg"} onClick={() => setShowPopupAdmin(!showPopupAdmin)} alt={"Admin window"} title={"Admin window"}/>

                        {showAdminOptions && showPopupAdmin && adminOptionsSettings()}
                            {/*<span style={{float:"right"}}>
                                <Button image={`/block-message-${muteID === undefined ? "red" : "green"}.svg`} onClick={() => {handleMute()}} alt={"Mute"} margin={"0 5px 0 0"} title={`${muteID != undefined && "Un" || ""}Mute`}/>
                                <Button image={"/door-red.svg"} onClick={() => {handleKick()}} alt={"Kick"} margin={"0 5px 0 0"} title={"Kick"}/>
                                <Button image={`/hammer-${banID === undefined ? "red" : "green"}.svg`} onClick={() => {handleBan()}}  alt={"Ban"} title={`${banID !== undefined && "Un" || ""}Ban`}/>
                            </span>*/}

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