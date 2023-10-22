import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('Credential')
export class UserCredentialEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'varchar',
		length: 60,
	})
	password: string;

	@Column({
		type: 'varchar',
		length: 100,
		default: null,
		nullable: true,
	})
	token_2fa: string;
}

@Entity('ChannelCredential')
export class ChannelCredentialEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'varchar',
		length: 60,
		nullable: true,
	})
	password: string;
}
