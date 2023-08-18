import {useContext, useState} from "react";

'user client'

import Axios from "./AxiosConfig";
import { strRoutes } from "@/shared/routesApi";
import { IUser } from "@/shared/types";
import axios from "axios";
import {LoggedContext, TokenContext} from "@/context/globalContext";


//const Axios = require('axios');
export const axiosInstance = axios.create({
	baseURL: 'http://localhost:8000/api/',
	headers: {
		'Authorization': `Bearer ${localStorage.getItem('token')}`
	},
	validateStatus: function (status) {
		return status >= 200 && status < 204;
	},
	responseType: 'json'
});



export namespace getApi {

	export const getUsersAll=()									: Promise<IUser[]>					=>{


		return axiosInstance.get(`${strRoutes.getUsersAll()}`);}
	export const getUserByLogin= (login: string): Promise<IUser>						=>{
		
		return axiosInstance.get(`users/get/${login}`, {cache: 'no-cache'});}
	export const getUserById = (id: number) 		: Promise<IUser>						=>{return axiosInstance.get(`${strRoutes.getUserById()}${id}`);}
    export const getMe = () => {
		
		return axiosInstance.get(`users/me`, {cache: 'no-cache'})}
}

export namespace postApi {

	export const postUser= (newUser: Partial<IUser>)												=>{return axiosInstance.post(`${strRoutes.postUser()}`, newUser);}
	export const postTryLogin= (loginTest:{login:string,password :string})	=>{return axiosInstance.post(`${strRoutes.postUserCheckLogin()}`, loginTest);}

}


export namespace putApi {
	export const putUser= (updateUser: Partial<IUser>)		=>{return axiosInstance.put(`${strRoutes.putUser()}${updateUser.id_user}`, updateUser)}
}

export namespace deleteApi {

	export const deleteUserById= (id: number)																=>{return Axios.delete(`${strRoutes.deleteUserById()}${id}`)}
	export const deleteUsersAll= ()																					=>{return axiosInstance.delete(`${strRoutes.deleteUsersAll()}`);}
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
			return res.status === 201;
		} 
		catch (error) {
			console.error(error);
			return false;
		}
	}

	export async function isOnline(id: number): Promise<boolean> {
		try {
			return (await getApi.getUserById(id)).status !== 0;
		} 
		catch (error) {
			console.error(error);
			return false;
		}
		
	}

}
