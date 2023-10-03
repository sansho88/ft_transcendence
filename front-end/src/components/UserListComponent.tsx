import React, { useState} from "react";
import {IUser} from "@/shared/types";
import * as apiReq from '@/components/api/ApiReq';
import Profile from "@/components/ProfileComponent";
import Button from "@/components/CustomButtonComponent";
import {v4 as uuidv4} from "uuid";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import NotifComponent from "@/components/notif/NotificationComponent";


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
const UserList : React.FC = ({className={className}}) => {

    const [userElements, setUserElements] = useState<React.JSX.Element[]>([]);
    const [isHidden, setIsHidden] = useState(userElements.length == 0);
    function handleClick(){
        if (isHidden)
        {
            getAllUsers().then((res) => {
                let allDiv : React.JSX.Element[] = [];
                for (const user of res) {
                    allDiv.push(
                            <li key={user.login + "List" + uuidv4()}>
                                <Profile login={user.login}
                                         nickname={user.nickname}
                                         avatar_path={user.avatar_path}
                                         UserID={user.UserID}
                                         status={user.status} //fixme: pas actualisé
                                         has_2fa={user.has_2fa}/>
                            </li>
                    )
                }
                setUserElements(allDiv);

                NotificationManager.info(`${allDiv.length} users loaded`);

            })
        }
        else
            setUserElements([]);
        setIsHidden(userElements.length > 0);

    }
    return (
        <>
            <Button className={className} image={"friends.svg"} onClick={handleClick} alt={"Online Users button"}/>
            {!isHidden && <div className={"userList"}>
                    <ul>
                    { userElements}
                    </ul>
            </div>}

        </>
    )
}

export default UserList;
