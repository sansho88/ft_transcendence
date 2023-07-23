import { POD, PODSQL } from "@/types/types";
import Axios from "./AxiosConfig";
import { strRoutes } from "@/types/routesApi";

//?? Faire un fichier par type de route USERS MESSAGES etc... 
// OU faire un seul fichier api avec toutes nos routes ici ??

const serverApi = "http://localhost:8000/api";


export namespace getApi {

	export const getUsersAll=()											=>{return Axios.get(`${strRoutes.getUsersAll()}`);}
	export const getUserByLogin=(login: string)			=>{return Axios.get(`${strRoutes.getUserByLogin}${login}`);}
	export const getUserById = (id: number) 				=>{return Axios.get(`${strRoutes.getUserById}${id}`);}

}

export namespace postApi {

	export const postUser= (newUser: PODSQL.Users)	=>{return Axios.post(`${strRoutes.postUser}`, newUser);}
	export const postTryLogin= (loginTest:{login:string,password :string})=>{
																										return Axios.post(`${strRoutes.postUserCheckLogin}`, loginTest);}

}


export namespace putApi {
	export const putUser= (updateUser: Partial<PODSQL.Users>) =>{return Axios.post(`${strRoutes.putUser}`, updateUser)}
}

export namespace deleteApi {

}


export namespace verificationUtils {

	export async function isLoginAlreadyTaken(login: string): Promise<boolean> {
		try {
			const res = await getApi.getUserByLogin(login);
			return res.status === 409 ? true : false;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	export async function isPasswordMatch(login: string) {
		// const res 
	}

}
