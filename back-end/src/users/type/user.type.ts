export interface IUser {
	Id_USERS?: number;
	username: string;
	avatar_path: string;
	status: number;
	token_2FA: string;
	has_2FA: boolean;
}
