import {
	PrimaryColumn,
	BaseEntity,
	Column,
	Entity,
	ManyToMany,
	JoinTable,
} from 'typeorm';

export enum UserStatus {
	INGAME = 2,
	ONLINE = 1,
	OFFLINE = 0,
}

@Entity('test')
export class User extends BaseEntity {
	@PrimaryColumn({
		type: 'varchar',
		length: 12,
	})
	login: string;

	@Column({
		type: 'varchar',
		length: 12,
	})
	username: string;

	// Todo: comeback later to proper storage
	@Column({
		type: 'varchar',
		length: 256,
		default: null,
		nullable: true,
	})
	avatar_path: string;

	@Column({
		type: 'varchar',
		length: 100,
		default: null,
		nullable: true,
	})
	token_2fa: string;

	@Column({
		type: 'enum',
		enum: UserStatus,
		default: UserStatus.ONLINE,
	})
	status: UserStatus;

	// @ManyToMany(() => User, (user) => user.subscribed)
	// followers: string;
	//
	// @ManyToMany(() => User, (user) => user.followers)
	// @JoinTable()
	// subscribed: string;

	@ManyToMany(() => User)
	@JoinTable()
	friend_list: User[];
}
