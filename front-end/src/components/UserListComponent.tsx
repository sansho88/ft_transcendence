import React, { use, useEffect, useState} from "react";
import Profile from "@/components/ProfileComponent";
import Button from "@/components/CustomButtonComponent";
import {v4 as uuidv4} from "uuid";
import UserOptions from "@/components/UserOptions";
import {getApi} from "@/components/api/ApiReq";
import getMyRelationships = getApi.getMyRelationships;
import getAllUsersFromChannel = getApi.getAllUsersFromChannel;
import { channelsDTO } from "@/shared/DTO/InterfaceDTO";
import { IUser } from "@/shared/types";

interface UserListProps{
    avatarSize?: string | undefined;
    usersList?: string | undefined;
    showUserProps?: boolean;
    adminMode?: boolean
    channelID?: number;
}
const UserList : React.FC<UserListProps> = ({className, id, userListIdProperty, avatarSize, showUserProps, usersList, adminMode, channelID}) => {

    const [userElements, setUserElements] = useState<React.JSX.Element[]>([]);
    const [isHidden, setIsHidden] = useState(userElements.length == 0);
    const [isPopupUsersVisible, setPopupUsersVisible] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        if (refresh) {
            setIsHidden(userElements.length == 0);
            setRefresh(false);
            handleClickUserList();
        }
    }, [refresh]);

    const allDivPush = (
        allDiv: React.JSX.Element[], 
        user: IUser,
        muteList: channelsDTO.IMuteEntity[], 
        follow: IUser[], 
        blocked: IUser[], 
        banID?: number) => {
        allDiv.push(
            <li key={user.login + "List" + uuidv4()}>
                <Profile user={user} avatarSize={avatarSize}>
                    {showUserProps == true && <UserOptions 
                    user={user} 
                    relationships={{followed: follow, blocked:blocked}} 
                    channelID={channelID} 
                    showAdminOptions={adminMode} 
                    setRefresh={setRefresh}
                    banID={banID} 
                    muteID={muteList.find(muteUser => muteUser.user.UserID === user.UserID)?.muteID ?? undefined}/>}
                </Profile>
            </li>
        )
        return allDiv;
    }

    function handleClickUserList(){
        if (isHidden)
        {
            let bannedList: channelsDTO.IBanEntity[] = [];
            let muteList: channelsDTO.IMuteEntity[] = [];
            setPopupUsersVisible(isHidden);
            let allDiv : React.JSX.Element[] = [];
            getMyRelationships().then(async (res) => {
                if (adminMode) {
                    bannedList = await getApi.getAllBanFromChannel(channelID ? channelID : -1).then((res) => {return res.data;});
                    muteList = await getApi.getAllMuteFromChannel(channelID ? channelID : -1).then((res) => {return res.data;});
                }
                const me = res.data;
                let subs = me.subscribed; //users suivis par l'actuel user
                let blocked = me.blocked;
            if (!usersList)
            {
                if (subs.length > 0) {
                    for (const user of subs) {
                        allDiv = allDivPush(allDiv, user, muteList, subs, blocked, undefined);
                    }
                    for (const user of bannedList) {
                        allDiv = allDivPush(allDiv, user.user, muteList, subs, blocked, user.bannedID);
                    }
                }
                else {
                    allDiv.push(
                        <div key={"NoUser" + uuidv4()}>No user followed</div>
                    )
                }
                setUserElements(allDiv);
            }
            else {
                getAllUsersFromChannel(channelID ? channelID : 0, new Date).then(async (res) => {
                    if (adminMode) {
                        bannedList = await getApi.getAllBanFromChannel(channelID ? channelID : -1).then((res) => {return res.data;});
                        muteList = await getApi.getAllMuteFromChannel(channelID ? channelID : -1).then((res) => {return res.data;});
                    }
                    for (const user of res.data) {
                        if (user.UserID > 1) {
                            allDiv = allDivPush(allDiv, user, muteList, subs, blocked, undefined);
                        }
                    }
                    for (const user of bannedList) {
                        allDiv = allDivPush(allDiv, user.user, muteList, subs, blocked, user.bannedID);
                    }
                    setUserElements(allDiv);
                })
                    .catch((error) => console.error("[UserList] Impossible to get users of channel: " + error));
            }
            })
                .catch((error) => console.error("[UserList] Impossible to get relationships of actual user: " + error));
        }
        else
            setUserElements([]);
        setIsHidden(userElements.length > 0);

    }
    return (
        <>
            {isPopupUsersVisible && <div id={"make_popup_disappear"} onClick={() => {
                setPopupUsersVisible(false)
                setIsHidden(true);
                setUserElements([]);
            }}></div>}
            <Button className={className} id={id} image={"friends.svg"} onClick={handleClickUserList} alt={"Online Users button"}/>
            {isPopupUsersVisible && !isHidden && <div id={"make_popup_disappear"} onClick={() => setIsHidden(true)}></div> &&
                <div className={"userList"} id={userListIdProperty} >
                    <ul>
                    {userElements}
                    </ul>
                </div>
            }

        </>
    )
}

export default UserList;
