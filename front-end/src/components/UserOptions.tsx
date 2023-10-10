import React, {useContext, useState} from "react";
import {IUser} from "@/shared/types";
import Button from "@/components/CustomButtonComponent";
import {UserContext} from "@/context/globalContext";
import * as apiReq from '@/components/api/ApiReq'

export interface userOptionsProps {
   user: IUser;
   isViewerAdmin?: boolean;
}
const UserOptions: React.FC<userOptionsProps> = ({classname, idProperty, user, isViewerAdmin}) => {
    const {userContext, setUserContext} = useContext(UserContext);
    const [isFollowed, setIsFollowed] = useState(false);

    return (
        <>
            <span>
                {!isFollowed ? <Button image={"/add-user.svg"} onClick={() => console.log("Follow User button")/*apiReq.putApi.followUser(user.UserID)*/} alt={"Follow"}/>
                    : <Button image={"/remove-user.svg"} onClick={() => console.log("Unfollow User button")/*apiReq.putApi.unfollowUser(user.UserID)*/} alt={"Unfollow"}/>}


                <Button image={"/send-message.svg"} onClick={() => console.log("send MP button")} alt={"Send MP"}/>
                <Button image={"/user-block.svg"} onClick={() => console.log("Block User button")} alt={"Block"}/> |
                <Button image={"/block-message.svg"} onClick={() => console.log("Mute User button")} alt={"Mute"}/>
                <Button image={"/hammer.svg"} onClick={() => console.log("Ban User button")} alt={"Ban"}/>
            </span>
        </>
    )

};

export  default  UserOptions;