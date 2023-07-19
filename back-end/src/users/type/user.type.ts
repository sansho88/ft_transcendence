export interface IUser {
	Id_USERS?: number;
	login: string;
	avatar_path: string;
	status: number;
	token_2FA: string;
	has_2FA: boolean;
}
