import { IUser } from "../types";

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
		name: string;
		password: string | null;
		privacy: boolean;
	}
}