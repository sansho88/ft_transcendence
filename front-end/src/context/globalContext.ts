import {createContext} from 'react'
import { IUser, IOriginNetwork } from '../shared/types' 
import { io, Socket } from "socket.io-client";

const originDefault: IOriginNetwork = {
	domain:   "",
	apiPort:  "",
	appPort:  ""
}

export type UserContextType = {
	userContext: IUser | undefined;
	setUserContext: (value: IUser | undefined) => void;
};

export type LoggedContextType = {
  logged: boolean;
  setLogged: (value: boolean) => void;
};

export type SocketContextType = {
	socket?: Socket;	
}


// export const SocketContextChat = createContext<Socket>(io(`http://${originDefault.domain}:${originDefault.apiPort}`, { autoConnect: false })); //WIP
// export const SocketContextGame = createContext<Socket>(io(`http://${originDefault.domain}:${originDefault.apiPort}`, { autoConnect: false })); //WIP
export const SocketContextChat = createContext<Socket | null>(null);
export const SocketContextGame = createContext<Socket | null>(null);
export const ThemeContext = createContext<string>("light");
export const OriginContext = createContext<IOriginNetwork>(originDefault);
export const UserContext = createContext<UserContextType>({ userContext: undefined, setUserContext: ()=> {}});
export const LoggedContext = createContext<LoggedContextType>({logged: false, setLogged: ()=> {}});