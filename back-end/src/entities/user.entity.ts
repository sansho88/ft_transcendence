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
import {MessageEntity} from './message.entity';
import {UserCredentialEntity} from './credential.entity';
import {InviteEntity} from './invite.entity';
import {MuteEntity} from './mute.entity';
import {BannedEntity} from './banned.entity';
import {ChannelEntity} from './channel.entity';

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

	@Column({
		type: 'boolean',
		default: false,
	})
	has_2fa: boolean;

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

	@OneToOne(() => UserCredentialEntity, {cascade: true})
	@JoinColumn()
	credential: UserCredentialEntity;

	@OneToMany(() => MessageEntity, (message) => message.author)
	@JoinColumn()
	message: MessageEntity[];

	//	Friends
	@ManyToMany(() => UserEntity, (user) => user.subscribed)
		// @JoinTable()
	followers: UserEntity[];

	@ManyToMany(() => UserEntity, (user) => user.followers)
	@JoinTable({name: 'TestSubscriber'})
	subscribed: UserEntity[];

	@ManyToMany(() => UserEntity)
	@JoinTable({name: 'TestSubscriber'})
	blocked: UserEntity[];

	@OneToMany(() => InviteEntity, (invite) => invite.user)
	invite: InviteEntity[];

	@OneToMany(() => MuteEntity, (mute) => mute.user)
	mute: MuteEntity[];

	@OneToMany(() => BannedEntity, (banned) => banned.user)
	banned: BannedEntity[];

	@ManyToMany(() => ChannelEntity, (channel) => channel.userList)
		// @JoinTable()
	channelJoined: ChannelEntity[];

	@OneToMany(() => ChannelEntity, (channel) => channel.adminList)
		// @JoinTable()
	channelAdmin: ChannelEntity[];

	@OneToMany(() => ChannelEntity, (channel) => channel.owner)
	@JoinColumn()
	channelOwned: ChannelEntity[];

	// @Column()
	// @ManyToMany(() => UserEntity)
	// @JoinTable()
	// friend_list: UserEntity[];
}
