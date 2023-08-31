import React, {useDebugValue, useEffect, useState} from "react";
import {IUser} from "@/shared/types";
import * as apiReq from '@/components/api/ApiReq';
import Profile from "@/components/ProfileComponent";
import Button from "@/components/CustomButtonComponent";
import {state} from "sucrase/dist/types/parser/traverser/base";


async function getAllUsers(): Promise<IUser[]>  {
    return await apiReq.getApi.getUsersAllPromise()
        .then((req) => {
            console.log("[Get All Users DEBUG]" + req.data.length);
            return req.data;
        })
        .catch(e => console.error("[Get All Users ERROR]" + e));
}
async function waitForallUsers(dataToFill: IUser[]) {
    await getAllUsers().then((users) => {

        dataToFill = users;
        console.log("USERLIST QUOICOUCEH" + users.length);
    })
    console.log("AllUsers size: " + dataToFill.length);
}

const UserList : React.FC = () => {


    let divU: React.JSX.Element[];
    const [divUsers, setDivUsers] = useState(divU);
   /*
    const tmpUser: IUser = {has_2fa: false, status: 0, login:"", UserID: 0}
    allUsers.push(tmpUser)*/
    let allUsers : IUser[];
    waitForallUsers(allUsers);

    useDebugValue(divUsers);

    function handleClick(){
        let users: IUser[];
        waitForallUsers(users)
    }

    function showUsers(users: IUser[]){
        let allDiv : React.JSX.Element[] = [];
        for (const user of users) {
            allDiv.push(<ol>
                {
                    <Profile login={user.login} status={user.status} has_2fa={user.has_2fa}/>
                }
            </ol>)
        }
        return (allDiv);
    }

   // console.log("Debug USERS Length: " + allUsers.length);
    return (
        <>
            <Button image={"friends.svg"} onClick={handleClick} alt={"Online Users button"}/>
            <h3>USERS LIST</h3>
            {
               showUsers(allUsers)
            }
        </>
    )
}

export default UserList;