import {
	PrimaryColumn,
	BaseEntity,
	Column,
	Entity,
	ManyToMany,
	JoinTable,
	OneToMany,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn,
} from 'typeorm';
import { MessageEntity } from './message.entity';
import { UserCredentialEntity } from './credential.entity';

export enum UserStatus {
	INGAME = 2,
	ONLINE = 1,
	OFFLINE = 0,
}

@Entity('TestUser')
export class UserEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	UserID: number;

	@PrimaryColumn({
		type: 'varchar',
		length: 10,
		unique: true,
		update: false,
	})
	login: string;

	@Column({
		type: 'varchar',
		length: 12,
	})
	nickname: string;

	@Column({
		type: 'boolean',
	})
	visit: boolean;

	// Todo: comeback later to proper storage
	@Column({
		type: 'varchar',
		length: 256,
		default: null,
		nullable: true,
	})
	avatar_path: string;

	@Column({
		type: 'enum',
		enum: UserStatus,
		enumName: `User Status`,
		default: UserStatus.ONLINE,
	})
	status: UserStatus;

	@OneToOne(() => UserCredentialEntity, { cascade: true })
	@JoinColumn()
	credential: UserCredentialEntity;

	@OneToMany(() => MessageEntity, (message) => message.author)
	message: MessageEntity[];

	//	Friends
	@ManyToMany(() => UserEntity, (user) => user.subscribed)
	followers: UserEntity;

	@ManyToMany(() => UserEntity, (user) => user.followers)
	@JoinTable()
	subscribed: UserEntity;

	// @Column()
	// @ManyToMany(() => UserEntity)
	// @JoinTable()
	// friend_list: UserEntity[];
}
