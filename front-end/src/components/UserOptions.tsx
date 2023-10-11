import React, {useContext, useState} from "react";
import {IUser} from "@/shared/types";
import Button from "@/components/CustomButtonComponent";
import {UserContext} from "@/context/globalContext";
import * as apiReq from '@/components/api/ApiReq'
import {NotificationManager} from 'react-notifications';

export interface userOptionsProps {
   user: IUser;
   showAdminOptions?: boolean;
}
const UserOptions: React.FC<userOptionsProps> = ({classname, idProperty, user, showAdminOptions}) => {
    const {userContext, setUserContext} = useContext(UserContext);
    const [isFollowed, setIsFollowed] = useState(false);

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

    return (
        <>
            {userContext.UserID != user.UserID &&
                <div style={{marginTop:"10px"}}>
                <span >
                    {!isFollowed ? <Button image={"/add-user.svg"} onClick={handleFollow/*apiReq.putApi.followUser(user.UserID)*/} alt={"Follow"}/>
                        : <Button image={"/remove-user.svg"} onClick={handleFollow/*apiReq.putApi.unfollowUser(user.UserID)*/} alt={"Unfollow"}/>}


                    <Button image={"/send-message.svg"} onClick={() => console.log("send MP button")} alt={"Send MP"}/>
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