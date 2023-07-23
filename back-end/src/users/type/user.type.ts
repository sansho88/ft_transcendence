export interface IUser {
	id_user?: number;
	login: string;
	nickname: string;
	avatar_path: string;
	status: number;
	token_2fa: string;
	has_2fa: boolean;
}
