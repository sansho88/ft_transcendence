'user client'

import Axios from "./AxiosConfig";
import { strRoutes } from "@/shared/routesApi";
import { IUser } from "@/shared/types";

export namespace getApi {

	export const getUsersAll=()									: Promise<IUser[]>					=>{return Axios.get(`${strRoutes.getUsersAll()}`);}
	export const getUserByLogin=(login: string)	: Promise<IUser>						=>{return Axios.get(`${strRoutes.getUserByLogin()}${login}`);}
	export const getUserById = (id: number) 		: Promise<IUser>						=>{return Axios.get(`${strRoutes.getUserById()}${id}`);}

}

export namespace postApi {

	export const postUser= (newUser: Partial<IUser>)												=>{return Axios.post(`${strRoutes.postUser()}`, newUser);}
	export const postTryLogin= (loginTest:{login:string,password :string})	=>{return Axios.post(`${strRoutes.postUserCheckLogin()}`, loginTest);}

}


export namespace putApi {
	export const putUser= (updateUser: Partial<IUser>)		=>{return Axios.put(`${strRoutes.putUser()}${updateUser.id_user}`, updateUser)}
}

export namespace deleteApi {

	export const deleteUserById= (id: number)																=>{return Axios.delete(`${strRoutes.deleteUserById()}${id}`)}
	export const deleteUsersAll= ()																					=>{return Axios.delete(`${strRoutes.deleteUsersAll()}`);}
}


// +---------------------------------------------------------------------+
// |                              UTILS                                  |
// +---------------------------------------------------------------------+

export namespace utilsCheck {

	export async function isLoginAlreadyTaken(login: string): Promise<boolean> {
		if (!login){	
			console.log('Call isLoginAlreadyTaken: login is empty !')
			return false;
		}
		console.log('Call isLoginAlreadyTaken: login = ||' + login + '||')
		try {
			await getApi.getUserByLogin(login);
			return true;
		}
		catch (error) {
			console.error(error);
			return false;
		}
	}

	export async function isPasswordMatch(login: string, password: string) {
		console.log('\n\ncall isPasswordMatch: login: ||' + login + '||\npassword: ||' + password + '||\n\n');
		try {
			const res = await postApi.postTryLogin({login, password});
			return res.status === 201 ? true : false;
		} 
		catch (error) {
			console.error(error);
			return false;
		}
	}

	export async function isOnline(id: number): Promise<boolean> {
		try {
			return (await getApi.getUserById(id)).status !== 0 ? true : false;
		} 
		catch (error) {
			console.error(error);
			return false;
		}
		
	}

}