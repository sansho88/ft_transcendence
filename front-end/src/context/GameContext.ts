import {createContext} from 'react'
import { IUser, IOriginNetwork } from '../shared/types' 

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

export const ThemeContext = createContext<string>("light");
export const OriginContext = createContext<IOriginNetwork>(originDefault);
export const SocketContext = createContext(null); //WIP
export const UserContext = createContext<UserContextType>({ userContext: undefined, setUserContext: ()=> {}});
export const LoggedContext = createContext<LoggedContextType>({logged: false, setLogged: ()=> {}});