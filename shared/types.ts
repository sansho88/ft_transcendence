import { ApiProperty } from "@nestjs/swagger";

export enum EStatus {
	Offline,
	Online,
	InGame
}

export interface IUser {
	Id_USERS?: number;
	login: string;
	nickname: string;
	avatar_path: string;
	status: number;
	token_2FA: string;
	has_2FA: boolean;
}

export interface IChatMessage {
	clientId: number;
	clientSocketId?: string;
	clientPsedo: string;
	message: string;
}