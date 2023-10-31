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

        return (
            <div>
                <NotificationContainer enterTimeout={800} leaveTimeout={500}/>
            </div>
        );
}

export default Notif;