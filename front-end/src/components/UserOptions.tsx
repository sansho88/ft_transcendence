import React, {useContext, useState} from "react";
import {IUser} from "@/shared/types";
import Button from "@/components/CustomButtonComponent";
import {UserContext} from "@/context/globalContext";
import * as apiReq from '@/components/api/ApiReq'

export interface userOptionsProps {
   user: IUser;
   showAdminOptions?: boolean;
}
const UserOptions: React.FC<userOptionsProps> = ({classname, idProperty, user, showAdminOptions}) => {
    const {userContext, setUserContext} = useContext(UserContext);
    const [isFollowed, setIsFollowed] = useState(false);

    function handleFollow(){
        if (!isFollowed)
            apiReq.putApi.followUser(user.UserID);
        else
            apiReq.putApi.unfollowUser(user.UserID);
        setIsFollowed(!isFollowed);
    }

    return (
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
        </div>
    )

};

export  default  UserOptions;