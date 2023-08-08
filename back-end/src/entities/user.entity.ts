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
import { CredentialEntity } from './credential.entity';

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
		length: 12,
		unique: true,
	})
	login: string;

	@Column({
		type: 'varchar',
		length: 12,
	})
	nickname: string;

	@Column()
	Invite: boolean; //Todo: rename to visit

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
		default: UserStatus.ONLINE,
	})
	status: UserStatus;

	@OneToOne(() => CredentialEntity, { cascade: true })
	@JoinColumn()
	credential: CredentialEntity;

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
