import React, { useState} from "react";
import {IUser} from "@/shared/types";
import * as apiReq from '@/components/api/ApiReq';
import Profile from "@/components/ProfileComponent";
import Button from "@/components/CustomButtonComponent";
import {v4 as uuidv4} from "uuid";
import {NotificationManager} from 'react-notifications';
import UserOptions from "@/components/UserOptions";
import {getApi} from "@/components/api/ApiReq";
import getMyRelationships = getApi.getMyRelationships;

interface UserListProps{
    avatarSize?: string | undefined;
    usersList?: IUser[] | undefined;
    showUserProps?: boolean;
    adminMode?: boolean
}

async function getAllUsers(): Promise<IUser[]>  {
    try {
        const timestamp = Date.now();
        return await apiReq.getApi.getUsersAllPromise(timestamp)
            .then((req) => {
                return req.data;
            })
    }catch(e){
        console.error("[Get All Users ERROR]" + e);
        throw e;
    }

}
const UserList : React.FC<UserListProps> = ({className, id, userListIdProperty, avatarSize, showUserProps, usersList, adminMode}) => {

    const [userElements, setUserElements] = useState<React.JSX.Element[]>([]);
    const [isHidden, setIsHidden] = useState(userElements.length == 0);
    const [isPopupUsersVisible, setPopupUsersVisible] = useState(false);
    function handleClick(){
        console.log(`isHidden;${isHidden}, isPopupVisible"${isPopupUsersVisible}`);
        if (isHidden)
        {
            setPopupUsersVisible(isHidden);
            let allDiv : React.JSX.Element[] = [];
            getMyRelationships().then((res) => {
                const me = res.data;
                let subs = me.subscribed; //users suivis par l'actuel user
                let followers = me.followers; //users qui suivent l'actuel user
                let blocked = me.blocked;
                const isUserSubscribedToMe = !!subs.find(tmpUser => tmpUser.UserID);
            if (!usersList)
            {
                    if (subs.length > 0){
                        for (const user of subs) {
                            allDiv.push(
                                <li key={user.login + "List" + uuidv4()}>
                                    <Profile user={user} avatarSize={avatarSize} showStats={isUserSubscribedToMe}>
                                        {showUserProps == true && <UserOptions user={user} relationships={{followed: subs, blocked:blocked}}/>}
                                    </Profile>
                                </li>
                            )
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
                for (const user of usersList) {
                    allDiv.push(
                        <li key={user.login + "List" + uuidv4()}>
                            <Profile user={user} avatarSize={avatarSize}>
                                {showUserProps == true && <UserOptions user={user} relationships={{followed: subs, blocked: blocked}} showAdminOptions={adminMode}/>}
                            </Profile>
                        </li>
                    )
                }
                setUserElements(allDiv);
            }
            })
                .catch((error) => console.error("[UserList] Impossible to get relationships of actual user: " + error));
                NotificationManager.info(`${allDiv.length} users loaded`);
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
            <Button className={className} id={id} image={"friends.svg"} onClick={handleClick} alt={"Online Users button"}/>
            {isPopupUsersVisible && !isHidden && <div id={"make_popup_disappear"} onClick={() => setIsHidden(true)}></div> &&
                <div className={"userList"} id={userListIdProperty} >
                    <ul>
                    { userElements}
                    </ul>
                </div>

            }

        </>
    )
}

export default UserList;
