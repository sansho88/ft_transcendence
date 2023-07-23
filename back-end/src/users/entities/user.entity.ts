import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EStatus } from '../../../shared/types';

@Entity('users')
export class User {
	@ApiProperty({ example: 1, description: 'Id of the user' })
	@PrimaryGeneratedColumn()
	id_user: number;

	@ApiProperty({ example: 'bducrocq', description: 'login of the user / sera set via success log sur api42' })
	@Column({ type: 'varchar', length: 24, nullable: false })
	login: string;

	@ApiProperty({ example: 'ben', description: 'nickname of the user' })
	@Column({ type: 'varchar', length: 24, nullable: true })
	nickname: string;

	@ApiProperty({ example: 'avatar.png', description: 'path to the avatar of the user/par default sera le path vers photo de l\'user' })
	@Column({ type: 'varchar', length: 256, nullable: true })
	avatar_path: string;

	@ApiProperty({ example: 1, description: 'status of the user', enum: EStatus })
	@Column({ type: 'smallint', nullable: false })
	status: number;

	@ApiProperty({ example: 'password', description: 'password of the user' })
	@Column({ type: 'varchar', length: 100, nullable: true })
	password: string;

	@ApiProperty({ example: 'token_2fa', description: 'token_2fa of the user' })
	@Column({ type: 'varchar', length: 100, nullable: true })
	token_2fa: string;

	@ApiProperty({ example: true, description: 'has 2FA activated' })
	@Column({ type: 'boolean', nullable: false })
	has_2fa: boolean;
}
