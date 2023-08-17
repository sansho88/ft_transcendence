import {createContext} from 'react'
import { IUser, IOriginNetwork } from '../shared/types' 
import { io, Socket } from "socket.io-client";

const originDefault: IOriginNetwork = {
	domain:   "",
	apiPort:  "",
	appPort:  ""
}

export type UserContextType = {
	userContext: Partial<IUser> ;
	setUserContext: (value: Partial<IUser>) => void;
};

export type LoggedContextType = {
  logged: boolean;
  setLogged: (value: boolean) => void;
};

export type SocketContextType = {
	socket?: Socket;	
}

export type TokenContextType = {
	token: string;
	setToken: (value: string) => void;
};


// export const SocketContextChat = createContext<Socket>(io(`http://${originDefault.domain}:${originDefault.apiPort}`, { autoConnect: false })); //WIP
// export const SocketContextGame = createContext<Socket>(io(`http://${originDefault.domain}:${originDefault.apiPort}`, { autoConnect: false })); //WIP
export const SocketContextChat = createContext<Socket | null>(null);
export const SocketContextGame = createContext<Socket | null>(null);
export const ThemeContext = createContext<string>("light");
export const OriginContext = createContext<IOriginNetwork>(originDefault);
export const UserContext = createContext<UserContextType>({ userContext: {}, setUserContext: ()=> {}});
export const LoggedContext = createContext<LoggedContextType>({logged: localStorage.getItem("login") != null, setLogged: ()=> {}});

export const TokenContext = createContext<TokenContextType>({token: "", setToken: () => {}});