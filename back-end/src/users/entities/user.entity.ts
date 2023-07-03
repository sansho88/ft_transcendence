import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id_users: number;

	@Column('varchar', { length: 12 })
	username: string;

	@Column('varchar', { length: 256 })
	avatar_path: string;

	@Column('varchar', { length: 100 })
	token_2fa: string;

	@Column('boolean', { default: false })
	has_2fa: boolean;
}
