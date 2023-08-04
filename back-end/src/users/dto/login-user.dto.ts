import { ApiProperty } from "@nestjs/swagger";

//dev test - requete POST pour comparer hash password pour user (servira pour les channels sur le principe..)
export class LoginUserDto {
	@ApiProperty({ example: 'bducrocq', description: 'login de l\'utilisateur' })
	login: string;
	@ApiProperty({ example: '123456', description: 'Input: mot de passe entré pour tenter la connexion' })
	password: string;
}
