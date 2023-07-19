import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('USERS')
export class User {
	@PrimaryGeneratedColumn()
	Id_USERS: number;

	@Column({ type: 'varchar', length: 24, nullable: false })
	login: string;

	@Column({ type: 'varchar', length: 24, nullable: true })
	nickname: string;

	@Column({ type: 'varchar', length: 256, nullable: true })
	avatar_path: string;

	@Column({ type: 'smallint', nullable: false })
	status: number;

	@Column({ type: 'varchar', length: 100, nullable: true })
	token_2FA: string;

	@Column({ type: 'boolean', nullable: false })
	has_2FA: boolean;
}
