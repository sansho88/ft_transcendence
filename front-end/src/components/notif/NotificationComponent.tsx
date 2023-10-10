import React, {useContext, useEffect, useRef, useState} from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import './notifications.css';
import {type} from "os";
import * as PODGAME from "@/shared/typesGame";
import {SocketContextGame, UserContext} from "@/context/globalContext";
import {EStatus} from "@/shared/types";
import {putApi} from "@/components/api/ApiReq";
import * as apiReq from "@/components/api/ApiReq";

export interface NotifProps {
    type: string,
    message: string,
    title?: string,
    timeout?: number
}
const Notif : React.FC = () => {

    const socket      = useContext(SocketContextGame);
    const socketRef   = useRef(socket);
    const [notified, setNotified] = useState(false);
    const {userContext, setUserContext} = useContext(UserContext);



   /* socketRef.current?.on('gameFind', (data: PODGAME.IGameSessionInfo) => {
        let player2;
        if (!data.player2)
            player2 = "yourself";
        else
            player2 = data.player2.nickname;
        NotificationManager.info(`You'll play against ${player2}`, "GAME FOUND");
    }
    );

    socketRef.current?.on("endgame", (data) => {
        NotificationManager.success(JSON.stringify(data), "GAME OVER");

    })*/
/*
    useEffect(() => {
        let tmpUser = userContext;
       /!* if (!notified)
        {
            socketRef.current?.on('gameFind', (data: PODGAME.IGameSessionInfo) => {
                let player2;
                if (!data.player2)
                    player2 = "yourself";
                else
                    player2 = data.player2.nickname;
                NotificationManager.info(`You'll play against ${player2}`, "GAME FOUND");

            })
            setNotified(true);
        }
*!/

        socketRef.current?.on("endgame", (data) => {
            NotificationManager.success(JSON.stringify(data), "GAME OVER");

        })
    })*/

        return (
            <div>
                <NotificationContainer enterTimeout={800} leaveTimeout={500}/>
            </div>
        );
}

export default Notif;