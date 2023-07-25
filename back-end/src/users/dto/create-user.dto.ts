import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
	@ApiProperty({ type: String, description: 'login' })
	login: string;
	@ApiProperty({ type: String, description: 'nickname' })
	nickname?: string;
	@ApiProperty({ type: String, description: 'status enum en ligne ou non' })
	status: number;
	@ApiProperty({ type: String, description: 'Mot de passe hashé; en attendant OAuth API42' })
	password?: string;
	@ApiProperty({ type: String, description: 'Token 2FA si le client a activé l\'option' })
	token_2fa?: string;
	@ApiProperty({ type: Boolean, description: '2FA status' })
	has_2fa: boolean;
}
