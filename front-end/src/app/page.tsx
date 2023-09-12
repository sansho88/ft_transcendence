'use client';
import React, {useContext, useEffect} from "react";

import {preloadFont} from "next/dist/server/app-render/rsc/preloads";
import {LoggedContext} from '@/context/globalContext';
import {useRouter} from 'next/navigation';
import LoadingComponent from "@/components/waiting/LoadingComponent";


export default function Home() {
    preloadFont("../../_next/static/media/2aaf0723e720e8b9-s.p.woff2", "font/woff2");
    const {logged} = useContext(LoggedContext);
    const router = useRouter();

    useEffect(() => {
        console.log("DOUBIDOU");
        const tmpToken = localStorage.getItem('token');
        console.log("token found:" + !!tmpToken + ", logged:" + logged );
        if (!logged && !tmpToken)
        {
            console.log("Redirect to auth page");
            router.push('/auth');
        }
        else
        {
            console.log("Redirect to Home page");
            router.push('/home');
        }


    }, [logged]);

    /*
    useEffect(() => {
        console.log("Main Page: isLogged? " + logged);
        let storedLogin = localStorage.getItem("login");
        console.log("Main Page: localStorageLogin? " + storedLogin);
/!*
        if (!logged /!*&& !localStorage.getItem("login")*!/)
            router.push('/auth')
        else {
            console.log("User is already LOGGED as " + localStorage.getItem("login"))

        }*!/
    }, [logged])

*/


   // if (logged /*&& !localStorage.getItem("login")*/)
        return (<LoadingComponent/>
        )
}
