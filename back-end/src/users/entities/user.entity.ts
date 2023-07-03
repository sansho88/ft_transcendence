import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('test')
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id_users: number;

	@Column('varchar', { length: 12 })
	username: string;

	@Column('boolean', { default: false })
	has_2fa: boolean;
}
