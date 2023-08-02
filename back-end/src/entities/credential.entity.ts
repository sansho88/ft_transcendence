import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TestCredential')
export class CredentialEntity extends BaseEntity {
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

@Entity('TestChannelCredential')
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
