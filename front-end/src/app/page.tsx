'use client';
import React, {useContext, useEffect} from "react";

import {LoggedContext} from '@/context/globalContext';
import {useRouter} from 'next/navigation';
import LoadingComponent from "@/components/waiting/LoadingComponent";
import {authManager} from "@/components/api/ApiReq";
import {getUserMe} from "@/app/auth/Auth";
import {IUser} from "@/shared/types";


export default function Home() {
   /* preloadFont("../../_next/static/media/2aaf0723e720e8b9-s.p.woff2", "font/woff2");*/
    const {logged} = useContext(LoggedContext);
    const router = useRouter();

    useEffect(() => {
        authManager.setBaseURL('http://' + window.location.href.split(':')[1].substring(2) + ':8000/api/');
    });

    useEffect(() => {
        const tmpToken = localStorage.getItem('token');
        authManager.setToken(tmpToken);
        if (!logged && !tmpToken)
        {
            router.push('/auth');
        }
        else
        {
            try{
                let user: IUser;
               getUserMe(user)
                   .then((testUser) => {
                        if (testUser && testUser.UserID >= 0)
                        {
                            router.push('/home');
                        }
                        else
                        {
                            alert("An invalid token was saved in the browser." +
                                "\nPlease, log in again or create a new account.");
                        }
                    })
                    .catch((error) => {
                        console.error("[redirect useEffect error]" + error);
                    });

            }
            catch (e) {
                alert("An invalid token was saved in the browser." +
                "\nPlease, log in again or create a new account.");
            }
        }

    }, [logged]);

        return (
                <div className="welcome  w-screen bg-center bg-no-repeat bg-cover h-screen" style={{ backgroundImage: `url('images/background/bg_pongPod1.png')` }}>
                <LoadingComponent/>
                </div>
        )
}
