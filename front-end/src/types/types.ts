export namespace POD {
	export enum EStatus {
		Offline,
		Online,
		InGame,
	}

	export interface IUser { //utiliser plutot PODSQL.User
		Id_USERS?: number;
		login?: string;
		nickname?: string;
		password: string;
		avatar_path: string;
		status: number;
		token_2FA: string;
		has_2FA: boolean;
	}

	export interface IChatMessage {
		user: IUser;
		message: string;
	}

	export interface IOriginNetwork {
		domain: string;
		apiPort: number | string;
		appPort: number | string;
		apiDOM?: string;
		appDOM?: string;
	}

	export interface IInput {
		type: string;
		value: string;
		onKeyDown: any;
		onChange: any;
	}
}

/**********************************************/
/**********************************************/
/**********************************************/

export namespace PODSQL {

	export interface Game {
		Id_GAME: number;
		P1_score: number;
		P2_score: number;
		game_type: number;
		start_date: Date;
	}

	export interface Matchmaking {
		Id_MATCHMAKING: number;
	}

	export interface Users {
		Id_USERS?: number;
		login?: string;
		nickname: string;
		password?: string;
		avatar_path: string;
		status: number;
		token_2FA: string;
		has_2FA: boolean;
		Id_MATCHMAKING: number;
	}

	export interface Channels {
		Id_CHANNEL: number;
		type: number;
		password: string;
		Id_USERS: number;
	}

	export interface Messages {
		Id_CHANNEL: number;
		Id_USERS: number;
		Id_Message: number;
		date_msg: Date;
		content: string;
	}

	export interface Banned {
		Id_CHANNEL: number;
		Id_USERS: number;
		Id_BANNED: number;
	}

	export interface ChannelInvite {
		Id_CHANNEL: number;
		Id_USERS: number;
		Id_INVITATION: number;
	}

	export interface Mute {
		Id_CHANNEL: number;
		Id_USERS: number;
		Id_MUTE: number;
	}

	export interface Challenge {
		Id_USERS: number;
		Id_USERS_1: number;
		Id_CHALLENGE: number;
		accepted: boolean;
	}

	export interface Follow {
		Id_USERS: number;
		Id_USERS_1: number;
	}

	export interface Subscribe {
		Id_USERS: number;
		Id_USERS_1: number;
	}

	export interface Block {
		Id_USERS: number;
		Id_USERS_1: number;
	}

	export interface Joined {
		Id_USERS: number;
		Id_CHANNEL: number;
	}

	export interface Administrate {
		Id_USERS: number;
		Id_CHANNEL: number;
	}

	export interface Play {
		Id_USERS: number;
		Id_GAME: number;
	}

}
