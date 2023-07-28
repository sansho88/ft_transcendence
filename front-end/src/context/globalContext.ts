import {createContext} from 'react'
import { IUser, IOriginNetwork } from '@/shared/types'
import { Socket } from 'socket.io-client';

const originDefault: IOriginNetwork = {
	domain: '',
	apiPort: "",
	appPort: ""
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

export const ThemeContext = createContext<string>("light");
export const OriginContext = createContext<IOriginNetwork>(originDefault);
export const SocketContext = createContext<Socket | null>(null); //WIP
export const UserContext = createContext<UserContextType>({ userContext: undefined, setUserContext: ()=> {}});
export const LoggedContext = createContext<LoggedContextType>({logged: localStorage.getItem("login") != null, setLogged: ()=> {}});