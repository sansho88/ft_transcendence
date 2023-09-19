'use client';
import React, {useContext, useEffect} from "react";

import {preloadFont} from "next/dist/server/app-render/rsc/preloads";
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
        if (!logged && !tmpToken)
        {
            console.log("Redirect to auth page");
            router.push('/auth');
        }
        else
        {
            try{
               getUserMe().then((testUser) => {
                        if (testUser && testUser.UserID >= 0)
                        {
                            console.log("Redirect to Home page");
                            router.push('/home');
                        }
                        else
                        {
                            console.log("testUser id= " + testUser.UserID);
                            alert("An invalid token was saved in the browser." +
                                "\nPlease, log in again or create a new account.");
                            localStorage.clear();
                            router.push('/auth');
                        }
                    })
                        .catch((error) => {
                            console.error("[redirect useEffect error]" + error);
                        });

            }
            catch (e) {
                alert("An invalid token was saved in the browser." +
                "\nPlease, log in again or create a new account.");
                localStorage.clear();
                router.push('/auth');
            }
        }

    }, [logged]);

        return (
            <>
                <div className="welcome space-y-10 my-12">
                    <div className="welcome-msg">WELCOME TO</div>
                    <div className="welcome-title ">PONG POD!</div>
                </div>
                <LoadingComponent/>
            </>
        )
}
