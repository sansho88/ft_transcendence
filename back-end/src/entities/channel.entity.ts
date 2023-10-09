import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import {UserEntity} from './user.entity';
import {MessageEntity} from './message.entity';
import {ChannelCredentialEntity} from './credential.entity';
import {InviteEntity} from './invite.entity';
import {MuteEntity} from './mute.entity';
import {BannedEntity} from './banned.entity';

export enum ChannelType {
	PUBLIC, //No password No Privacy
	PROTECTED, //Yes Password No Privacy
	PRIVATE, //Maybe password Yes Privacy
	DIRECT,
}

@Entity('TestChannels')
export class ChannelEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	channelID: number;

	@ManyToOne(() => UserEntity, (UserEntity) => UserEntity.channelOwned, {eager: true})
	owner: UserEntity;

	/** Only Used if it's a Direct Channel*/
		// @ManyToOne(() => UserEntity)
		// owner2: UserEntity;

	@Column({
		type: 'varchar',
		length: 20,
	})
	name: string;

	@Column({
		type: 'enum',
		enum: ChannelType,
	})
	type: ChannelType;

	@Column({
		type: 'boolean',
	})
	mp: boolean;

	@OneToOne(() => ChannelCredentialEntity, {cascade: true})
	@JoinColumn({name: 'TestCredential'})
	credential: ChannelCredentialEntity;

	@ManyToMany(() => UserEntity, (UserEntity) => UserEntity.channelAdmin)
	@JoinTable({name: 'TestAdminList'})
	adminList: UserEntity[];

	@ManyToMany(() => UserEntity, (UserEntity) => UserEntity.channelJoined)
	@JoinTable({name: 'TestUserList'})
	userList: UserEntity[];

	@OneToMany(() => MessageEntity, (MessageEntity) => MessageEntity.channel)
	@JoinColumn({name: 'TestMessageList'})
	messages: MessageEntity[];

	@OneToMany(() => InviteEntity, (InviteEntity) => InviteEntity.channel)
		// @JoinTable({ name: 'TestInviteList' })
	inviteList: InviteEntity[];

	@OneToMany(() => MuteEntity, (MuteEntity) => MuteEntity.channel)
		// @JoinTable({ name: 'TestMuteList' })
	muteList: MuteEntity[];

	@OneToMany(() => BannedEntity, (BannedEntity) => BannedEntity.channel)
		// @JoinTable({ name: 'TestBannedList' })
	bannedList: BannedEntity[];
}
