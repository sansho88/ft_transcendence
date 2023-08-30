import React, { useEffect, useState} from "react";
import {IUser} from "@/shared/types";
import * as apiReq from '@/components/api/ApiReq';
import Profile from "@/components/ProfileComponent";

async function getAllUsers(): Promise<IUser[]>  {
    return await apiReq.getApi.getUsersAllPromise()
        .then((req) => {
            console.log("[Get All Users DEBUG]" + req.data.length);
            return req.data;
        })
        .catch(e => console.error("[Get All Users ERROR]" + e));
}
const UserList : React.FC = () => {

    let allUsers : IUser[];
    async function waitForallUsers() {
       await getAllUsers().then((users) => {
            allUsers = users;
           console.log("USERLIST QUOICOUCEH" + users.length);
       }) /*as IUser[]*/;
        console.log("AllUsers size: " + allUsers);
    }

    waitForallUsers().catch((e) => console.error("[UserList Error]" + e));

   // console.log("Debug USERS Length: " + allUsers.length);
    return (
        <>
            <h3>USERS LIST</h3>
            {
                /*usersElements.map((usersElement) => (
                    <div>
                        {<Profile login={usersElement.login} status={usersElement.status} has_2fa={usersElement.has_2fa}/>}
                    </div>
                ))*/
            }
        </>
    )
}

export default UserList;