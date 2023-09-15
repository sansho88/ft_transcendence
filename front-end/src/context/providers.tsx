"use client";

import {createContext, useContext, useEffect, useRef, useState} from "react";
import {IUser} from "@/shared/types";
import {
	ThemeContext,
	UserContext,
	LoggedContext,
	OriginContext,
	LoggedContextType,
  SocketContextChat,
  SocketContextGame
} from "@/context/globalContext";
import { IOriginNetwork } from "../shared/types";
import { io, Socket } from "socket.io-client";
// import websocketConnect from "@/websocket/websocket";

const IP_HOST = () => {
  if (typeof window !== 'undefined') 
    return window.location.hostname;
  else
    return `localhost`
}

const originDefault: IOriginNetwork = {
	domain: IP_HOST(),
	apiPort: 8000,
	appPort: 3000,
}

const originDefaultFull = (origin: IOriginNetwork): IOriginNetwork => {
	return {
			...origin,
			apiDOM: `http://${origin.domain}:${origin.apiPort}`,
			wsApiDOM: `ws://${origin.domain}:${origin.appPort}`,
			appDOM: `http://${origin.domain}:${origin.appPort}`,
	}
}

// export const SocketContextChat = createContext<Socket | null>(null);
// export const SocketContextGame = createContext<Socket | null>(null);

export function SocketProvider({ children }) {
  const [socketChat, setSocketChat] = useState<Socket | null>(null);
  const [socketGame, setSocketGame] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocketChat = io(`http://${originDefault.domain}:${originDefault.apiPort}/chat`, { autoConnect: false });
    const newSocketGame = io(`http://${originDefault.domain}:${originDefault.apiPort}/game`, { autoConnect: false });
    setSocketChat(newSocketChat);
    setSocketGame(newSocketGame);

    return () => {
      newSocketChat.close();
      newSocketGame.close();
    };
  },[]);


  return (
    <SocketContextChat.Provider value={socketChat}>
      <SocketContextGame.Provider value={socketGame}>
        {children}
      </SocketContextGame.Provider>
    </SocketContextChat.Provider>
  );
}

  export function Providers({children}) {
    const [isLogged, setIsLogged] = useState<boolean>(false);
    const [userContext, setUserContext] = useState<IUser>(null);
  
	return (
		<>
			<OriginContext.Provider value={originDefaultFull(originDefault)}>

					<SocketProvider>
						<UserContext.Provider value={{userContext: userContext, setUserContext: setUserContext}}>
							{children}
						</UserContext.Provider>
					</SocketProvider>

			</OriginContext.Provider>
		</>
	);
}
