'use client'

import {IMessageEntity} from "@/shared/entities/IMessage.entity";
import Axios from "./AxiosConfig";
import {strRoutes} from "@/shared/routesApi";
import {IGameStats, ILeaderboard, IMatch, IUser} from "@/shared/types";
import {IChannel} from "@/shared/typesChannel";
import axios from "axios";
import {IChannelEntity} from "@/shared/entities/IChannel.entity";
import {channelsDTO} from "@/shared/DTO/InterfaceDTO";
import { IInviteEntity } from "@/shared/entities/IInvite.entity";


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
	export const getUsersAllPromise = (time) => {
		const tqt = time;
		return axiosInstance.get(`${strRoutes.getUsersAll()}`, updateAxiosInstance());
	}
	export const getUserByLoginPromise = (login: string) => {
		return axiosInstance.get(`users/get/${login}`,);
	}

	export const getUserByIdPromise = (id: number) => {
		return axiosInstance.get(`${strRoutes.getUserById()}${id}`, {
			headers: {
				'Authorization': `Bearer ${authManager.getToken()}`
			}
		});
	}

	export const getChannels = (): Promise<IChannelEntity[]> => {

		return axiosInstance.get(`${strRoutes.channel.getAll()}`,

			{
				headers: {
					'Authorization': `Bearer ${authManager.getToken()}`
				}
			});
	}

	export const getAllUsersFromChannel = (channelID: number, time): Promise<{ data: IUser[] }> => {
		const tqt = time;
		return axiosInstance.get(`${strRoutes.channel.getUsersChannel(channelID)}`, updateAxiosInstance(), time);
	}

	export const getMePromise = () => {
		return axiosInstance.get(strRoutes.getMe(), updateAxiosInstance())
	}

	export const getMeUser = (): Promise<{ data: IUser }> => {
		return axiosInstance.get(strRoutes.getMe(), updateAxiosInstance())
	}

	export const getMyRelationships = (): Promise<{ data }> => {
		return axiosInstance.get(strRoutes.getMyRelationships(), updateAxiosInstance());
	}

	export const getOtherRelationships = (targetID: number): any => {
		return axiosInstance.get(strRoutes.getOtherRelationships(targetID), updateAxiosInstance());
	}

	export const getIsNicknameUsed = (nick: string) => {
		return axiosInstance.get(`${strRoutes.getIsNicknameIsUsed()}${nick}`, {
			headers: {
				'Authorization': `Bearer ${authManager.getToken()}`
			}
		});
	}

	interface IUserChan extends IUser {
		channelJoined: IChannel[];
	}

	export const getChannelJoined = (): any => {
		let user: IUserChan;
		const chanListJoined = async () => {
			user = await axiosInstance.get(`${strRoutes.channel.getChannelJoined()}`, {
				headers: {'Authorization': `Bearer ${authManager.getToken()}`}
			});
			chanListJoined();
			return user.channelJoined;
		}
	}

	export const getAllMessagesChannel = (channelID: number): Promise<{ data: IMessageEntity[] }> => {
		return axiosInstance.get(`${strRoutes.channel.getAllMessagesChannel(channelID)}`, {
			headers: {'Authorization': `Bearer ${authManager.getToken()}`}
		});
	}

	export const getAllBanFromChannel = (channelID: number): Promise<{data: channelsDTO.IBanEntity[]}> => {
		return axiosInstance.get(`${strRoutes.channel.getAllBanFromChannel(channelID)}`, {
			headers: { 'Authorization': `Bearer ${authManager.getToken()}` }
		});
	}

	export const getAllMuteFromChannel = (channelID: number): Promise<{data: channelsDTO.IMuteEntity[]}> => {
		return axiosInstance.get(`${strRoutes.channel.getAllMuteFromChannel(channelID)}`, {
			headers: { 'Authorization': `Bearer ${authManager.getToken()}` }
		});
	}

	export const getAllMyFollowers = (): Promise<{data:IUser[]}> => {

		return axiosInstance.get(`${strRoutes.relationships.getAllMyFollowers()}`, updateAxiosInstance());
	}

	export const getStatsFromAllUsers = (): Promise<{ data: IGameStats }> => {
		return axiosInstance.get(`${strRoutes.game.getStatsFromAllUsers()}`, updateAxiosInstance());
	}
	export const getUserStatsById = (userId: number): Promise<{ data: IGameStats }> => {
		return axiosInstance.get(`${strRoutes.game.getUserStatsById(userId)}`, updateAxiosInstance());
	}


	export const getMyChallenges = (): Promise<channelsDTO.IChallengeProposeDTO[]> => {
		return axiosInstance.get(`${strRoutes.game.getMyChallenges()}`, updateAxiosInstance());
	}

	export const getMatchHistory = (): Promise<{ data: IMatch[] }> => {
		return axiosInstance.get(strRoutes.game.getMatchHistory(), updateAxiosInstance());
	}
	export const getMatchHistoryFromUserId = (userId: number): Promise<{ data: IMatch[] }> => {
		return axiosInstance.get(strRoutes.game.getMatchHistoryFromUserId(userId), updateAxiosInstance());
	}

	export const getLeaderboard = (): Promise<{ data: ILeaderboard[] }> => {
		return axiosInstance.get(strRoutes.game.getLeaderboard(), updateAxiosInstance());
	}

	export const getMyInvite = () : Promise<{data: IInviteEntity[]}> => {
		return axiosInstance.get(strRoutes.channel.getMyInvite(), updateAxiosInstance());
	}

	export const getInviteChannelID = (channelID: number) : Promise<{data: IInviteEntity[]}> => {
		return axiosInstance.get(strRoutes.channel.getInviteChannel(channelID), updateAxiosInstance());
	}

}


export namespace postApi {

	export const postUser = (newUser: Partial<IUser>) => {
		return axiosInstance.post(`${strRoutes.postUser()}`, newUser);
	}
	export const postTryLogin = (loginTest: Partial<IUser>) => {
		return axiosInstance.post(`${strRoutes.postUserCheckLogin()}`, loginTest);
	}
	export const postTryLogin42 = (code: string, token: string | null) => {
		return axiosInstance.post(`${strRoutes.postUser42(token)}`, code);
	}
	export const postTryGetIntraURL = () => {
		return axiosInstance.post(`${strRoutes.getIntraURL()}`);
	}

	export const postGen2FA = () => {
		return axiosInstance.post(`${strRoutes.postGenerate2FA()}`, {}, updateAxiosInstance());
	}
	export const postCheck2FA = (token: string) => {
		return axiosInstance.post(`${strRoutes.postCheck2FA(token)}`, {}, updateAxiosInstance());
	}
	export const postDisable2FA = (token: string) => {
		return axiosInstance.post(`${strRoutes.postDisable2FA(token)}`, {}, updateAxiosInstance());
	}

	export const postUploadAvatar = (avatar: FormData) => {
		return axiosInstance.post(strRoutes.postUploadAvatar(), avatar, {
			headers: {
				'Authorization': `Bearer ${authManager.getToken()}`,
				'Content-Type': 'multipart/form-data',
			},
		});
	};
}


export namespace putApi {
	export const putUser = (updateUser: Partial<IUser>) => {
		return axiosInstance.put(`${strRoutes.putUser()}update`, updateUser, updateAxiosInstance())
	}
	export const followUser = (userID: number) => {
		return axiosInstance.put(`${strRoutes.relationships.followUser(userID)}`, {}, updateAxiosInstance());
	}
	export const unfollowUser = (userID: number) => {
		return axiosInstance.put(strRoutes.relationships.unfollowUser(userID), {}, updateAxiosInstance());
	}
	export const blockUser = (userID: number) => {
		return axiosInstance.put(`${strRoutes.relationships.blockUser(userID)}`, {}, updateAxiosInstance());
	}
	export const unblockUser = (userID: number) => {
		return axiosInstance.put(strRoutes.relationships.unblockUser(userID), {}, updateAxiosInstance());
	}
	export const putModifChannel = (channelID: number, data: channelsDTO.IChangeChannelDTOPipe) =>{return axiosInstance.put(`${strRoutes.channel.putModifChannel(channelID)}`, data, updateAxiosInstance())}
	
	export const inviteUserInChannel = (userID: number, channelID: number) => {
		return axiosInstance.put(strRoutes.channel.putAddInvite(channelID, userID),{}, updateAxiosInstance());
	}

	export const inviteIdRemove = (inviteID: number) => {
		return axiosInstance.put(strRoutes.channel.putInviteChannelRemove(inviteID),{}, updateAxiosInstance());
	}

	export const putMuteUser = (channelID: number, userID: number, duration: number) => {return axiosInstance.put(`${strRoutes.channel.putMuteUser(channelID, userID, duration)}`, {}, updateAxiosInstance())}
	export const putUnmuteUser = (muteID: number) => {return axiosInstance.put(`${strRoutes.channel.putUnmuteUser(muteID)}`, {}, updateAxiosInstance())}

	export const putKickUser = (channelID: number, userID: number) => {return axiosInstance.put(`${strRoutes.channel.putKickUser(channelID, userID)}`, {}, updateAxiosInstance())}

	export const putBanUser = (channelID: number, userID: number, duration: number) => {return axiosInstance.put(`${strRoutes.channel.putBanUser(channelID, userID, duration)}`, {}, updateAxiosInstance())}
	export const putUnbanUser = (banID: number) => {return axiosInstance.put(`${strRoutes.channel.putUnbanUser(banID)}`, {}, updateAxiosInstance())}

}

export namespace deleteApi {

	export const deleteUserById = (id: number) => {
		return Axios.delete(`${strRoutes.deleteUserById()}${id}`, {
			headers: {
				'Authorization': `Bearer ${authManager.getToken()}`
			}
		})
	}
	export const deleteUsersAll = () => {
		return axiosInstance.delete(`${strRoutes.deleteUsersAll()}`, {
			headers: {
				'Authorization': `Bearer ${authManager.getToken()}`
			}
		});
	}
}


// +---------------------------------------------------------------------+
// |                              UTILS                                  |
// +---------------------------------------------------------------------+

export namespace utilsCheck {

	export async function isLoginAlreadyTaken(login: string): Promise<boolean> {
		if (!login) {
			console.log('Call isLoginAlreadyTaken: login is empty !')
			return false;
		}
		console.log('Call isLoginAlreadyTaken: login = ||' + login + '||')
		try {
			await getApi.getUserByLoginPromise(login);
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	export async function isPasswordMatch(login: string, password: string, code2FAInput?: string) {
		console.log('\n\ncall isPasswordMatch: login: ||' + login + '||\npassword: ||' + password + '||\n\n');
		try {
			const res = await postApi.postTryLogin({login, password, token_2fa: code2FAInput});
			return res.status === 201;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	export async function isOnline(id: number): Promise<boolean> {
		try {
			return (await getApi.getUserByIdPromise(id)).status !== 0;
		} catch (error) {
			console.error(error);
			return false;
		}

	}

}
