import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
	@ApiProperty({ type: String, description: 'login' })
	login: string;
	@ApiProperty({ type: String, description: 'nickname' })
	nickname: string;
	@ApiProperty({ type: String, description: 'status enum en ligne ou non' })
	status: number;
	@ApiProperty({ type: String, description: 'Mot de passe hashé; en attendant OAuth API42' })
	token_2FA: string;
	@ApiProperty({ type: Boolean, description: '2FA activé ou non' })
	has_2FA: boolean;
}
