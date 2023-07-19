export class CreateUserDto {
	login: string;
	nickname?: string;
	avatar_path?: string;
	status?: number;
	token_2FA?: string;
	has_2FA?: boolean;
	Id_MATCHMAKING?: number;
}
