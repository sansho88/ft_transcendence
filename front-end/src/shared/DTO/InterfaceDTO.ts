export namespace messages {
	
	export interface ISendMessageDTOPipe {
		channelID: number;
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
}