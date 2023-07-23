"use client";

import {createContext, useRef, useState} from "react";
import {IUser} from "../interfaces/userType";
import {
	ThemeContext,
	SocketContext,
	UserContext,
	LoggedContext,
	OriginContext,
	LoggedContextType
} from "@/context/globalContext";
import { IOriginNetwork } from "../shared/types";
import { io, Socket } from "socket.io-client";
import websocketConnect from "@/api/websocket";

const originDefault: IOriginNetwork = {
	domain: 'http://localhost',
	apiPort: 8000,
	appPort: 3000,
}

const originDefaultFull = (origin: IOriginNetwork): IOriginNetwork => {
	return {
			...origin,
			apiDOM: `${origin.domain}:${origin.apiPort}`,
			appDOM: `${origin.domain}:${origin.appPort}`
	}
}



export function Providers({children}) {
	const [isLogged, setIsLogged] = useState<boolean>(false);
	const [userContext, setUserContext] = useState<IUser | undefined>(undefined);
	// const socketRef = useRef<Socket | null>(null);
	// const socketRef = io()
	

	return (
		<>
			<OriginContext.Provider value={originDefaultFull(originDefault)}>
					<LoggedContext.Provider value={{logged: isLogged, setLogged: setIsLogged}}>
						{/* <SocketContext.Provider value={socketRef}> */}
							<UserContext.Provider value={{userContext: userContext, setUserContext: setUserContext}}>
								{children}
							</UserContext.Provider>
						{/* </SocketContext.Provider> */}
					</LoggedContext.Provider>
			</OriginContext.Provider>
		</>
	);
}
