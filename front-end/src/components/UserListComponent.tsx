import React, {useDebugValue, useEffect, useState} from "react";
import {IUser} from "@/shared/types";
import * as apiReq from '@/components/api/ApiReq';
import Profile from "@/components/ProfileComponent";
import Button from "@/components/CustomButtonComponent";


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
                            <li key={user.login + "List"}>
                                <Profile login={user.login}
                                         nickname={user.nickname}
                                         avatar_path={user.avatar_path}
                                         status={user.status} //fixme: pas actualisé
                                         has_2fa={user.has_2fa}/>
                            </li>
                    )
                }
                setUserElements(allDiv);
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