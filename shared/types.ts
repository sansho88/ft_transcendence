export enum EStatus {
	Offline,
	Online,
	InGame
}

export interface IUser {
	Id_USERS?: number;
	login: string;
	nickname?: string;
	avatar_path: string;
	status: number;
	token_2FA: string;
	has_2FA: boolean;
}

export interface IChatMessage {
	clientId: number;
	clientPsedo: string;
	message: string;
}

export interface IOriginNetwork {
	domain: string;
	apiPort: number | string;
	appPort: number | string;
	apiDOM?: string;
	appDOM?: string;
}