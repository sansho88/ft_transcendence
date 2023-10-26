import { EGameMod, userInfoSocket } from "shared/typesGame";
import { IUser } from "../types";
import { IUserEntity } from "shared/entities/IUser.entity";
import { IChannelEntity } from "shared/entities/IChannel.entity";
import { UserEntity } from "src/entities/user.entity";
import { IChannel } from "../typesChannel";

export namespace messageDTO {
	
	export interface ISendMessageDTOPipe {
		channelID: number;
		content: string;
	}

	export interface IReceivedMessageEventDTO {
		channelID: number;
		author: IUser;
		content: string;
	}
}

export namespace channelsDTO {

	export interface ICreateChannelDTOPipe {
		name: string;
		privacy: boolean;
		password?: string;
	}
 
	export interface IJoinChannelDTOPipe {
		channelID: number;
		password?: string;
	}

	export interface ILeaveChannelDTOPipe {
		channelID: number;
	}

	export interface IChangeChannelDTOPipe {
		channelID: number; //for wsRoute
		name: string;
		password: string | null;
		privacy: boolean;
	}

	export interface ICreateMpDTOPPipe {
		targetID: number
	}

	export interface ICreateChallengeDTO {
		targetID: number;
		gameMod: EGameMod;
	}

	export interface IChallengeProposeDTO {
		challenger: Partial<IUser>;
		eventChallenge: string;
		gameMod: EGameMod;
	}
	
	export interface IChallengeAcceptedDTO {
		response: boolean;
		event: string;
	}

	export interface IInviteEntity {
		inviteID: number;
		user: IUserEntity;
		channel: IChannelEntity;
		sender: IUserEntity;
	}
		export interface IBanEntity {
		bannedID: number;
		endTime: Date | null;
		channel: IChannel;
		user: IUser;
	}

	export interface IMuteEntity {
		muteID: number;
		endTime: Date | null;
		channel: IChannel;
		user: IUser;
	}

	export interface IAdminEntity extends Partial<IUser> {
	}
}