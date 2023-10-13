import React, {useContext, useState} from "react";
import {IUser} from "@/shared/types";
import Button from "@/components/CustomButtonComponent";
import {UserContext, SocketContextChat} from "@/context/globalContext";
import * as apiReq from '@/components/api/ApiReq'
import {NotificationManager} from 'react-notifications';
import { wsChatRoutesBack } from "@/shared/routesApi";
import { wsChatEvents } from "./api/WsReq";
import { Socket } from "socket.io-client";


export interface userOptionsProps {
   user: IUser;
   showAdminOptions?: boolean;
   relationships: {followed:IUser[], blocked?:IUser[]};
}
const UserOptions: React.FC<userOptionsProps> = ({classname, idProperty, user, showAdminOptions, relationships}) => {
    const {userContext, setUserContext} = useContext(UserContext);
    const [isFollowed, setIsFollowed] = useState(!!relationships.followed.find(tmpUser => user.UserID == tmpUser.UserID));

    const socketRef = useContext(SocketContextChat)

    function handleFollow(){
        if (!isFollowed)
        {
            apiReq.putApi.followUser(user.UserID);
            NotificationManager.success(`You are now following ${user.nickname} (${user.login})`);
        }
        else
        {
            apiReq.putApi.unfollowUser(user.UserID);
            NotificationManager.success(`You don\'t follow ${user.nickname} (${user.login}) anymore.`);
        }
        setIsFollowed(!isFollowed);

    }

    function handleMp() {
        if (socketRef)
         {  
            console.log('Hey je suis handleMp')
            wsChatEvents.createMP(socketRef, { targetID: user.UserID });}
    }

    return (
        <>
            {userContext.UserID != user.UserID &&
                <div className={classname} id={idProperty} style={{marginTop:"10px"}}>
                    <span >
                        {!isFollowed ? <Button image={"/add-user.svg"} onClick={handleFollow} alt={"Follow"}/>
                            : <Button image={"/remove-user.svg"} onClick={handleFollow} alt={"Unfollow"}/>}


                        <Button image={"/send-message.svg"} onClick={handleMp} alt={"Send MP"}/>
                        <Button image={"/user-block.svg"} onClick={() => console.log("Block User button")} alt={"Block"}/>
                        {showAdminOptions
                            &&  <Button image={"/block-message.svg"} onClick={() => console.log("Mute User button")} alt={"Mute"}/>
                            &&  <Button image={"/hammer.svg"} onClick={() => console.log("Ban User button")} alt={"Ban"}/>
                        }
                    </span>
                </div>}
        </>
    )

};

export  default  UserOptions;