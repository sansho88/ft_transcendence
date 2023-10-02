'use client'

import Axios from "./AxiosConfig";
import { strRoutes } from "@/shared/routesApi";
import { IUser } from "@/shared/types";
import axios from "axios";

const AuthManager = require('./AuthManager');
export const authManager = new AuthManager();

export const axiosInstance = axios.create({
	baseURL: "http://localhost:8000/api/",
	validateStatus: function (status) {
		return status >= 200 && status < 204;
	},
});

function updateAxiosInstance() {
	return {
		baseURL: authManager.getBaseURL(),
		headers: {
			'Authorization': `Bearer ${authManager.getToken()}`
		}
	}
}

export namespace getApi {

	const timestamp = Date.now();
	export const getUsersAllPromise= (time) =>{
		const tqt = time;
		return axiosInstance.get(`${strRoutes.getUsersAll()}`, updateAxiosInstance());}
	export const getUserByLoginPromise= (login: string) =>{
		
		return axiosInstance.get(`users/get/${login}`, );}
	export const getUserByIdPromise = (id: number) =>{return axiosInstance.get(`${strRoutes.getUserById()}${id}`, {
		headers: {
			'Authorization': `Bearer ${authManager.getToken()}`
		}
	});}
    export const getMePromise = () => {
		return axiosInstance.get(`users/me`, updateAxiosInstance())}
}

export namespace postApi {

	export const postUser= (newUser: Partial<IUser>)		=>{return axiosInstance.post(`${strRoutes.postUser()}`, newUser);}
	export const postTryLogin= (loginTest:Partial<IUser>)	=>{return axiosInstance.post(`${strRoutes.postUserCheckLogin()}`, loginTest);}

}


export namespace putApi {
	export const putUser= (updateUser: Partial<IUser>)		=>{
		console.log("[putApi/putUser] status sent: " + updateUser.status);

		return axiosInstance.put(`${strRoutes.putUser()}update`, updateUser, updateAxiosInstance())}
}

export namespace deleteApi {

	export const deleteUserById= (id: number)	=>{
		return Axios.delete(`${strRoutes.deleteUserById()}${id}`, {
		headers: {
			'Authorization': `Bearer ${authManager.getToken()}`
		}
	})}
	export const deleteUsersAll= ()	=>{
		return axiosInstance.delete(`${strRoutes.deleteUsersAll()}`, {
		headers: {
			'Authorization': `Bearer ${authManager.getToken()}`
		}
	});}
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
			await getApi.getUserByLoginPromise(login);
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
			return res.status === 201;
		} 
		catch (error) {
			console.error(error);
			return false;
		}
	}

	export async function isOnline(id: number): Promise<boolean> {
		try {
			return (await getApi.getUserByIdPromise(id)).status !== 0;
		} 
		catch (error) {
			console.error(error);
			return false;
		}
		
	}

}
