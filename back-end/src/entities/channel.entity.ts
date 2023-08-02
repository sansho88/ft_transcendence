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
import { UserEntity } from './user.entity';
import { MessageEntity } from './message.entity';
import { ChannelCredentialEntity } from './credential.entity';
import { InviteEntity } from './invite.entity';

export enum ChannelType {
	PUBLIC,
	PROTECTED,
	PRIVATE,
	DIRECT,
}

@Entity('TestChannels')
export class ChannelEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	channelID: number;

	@ManyToOne(() => UserEntity)
	owner: UserEntity;

	/** Only Used if it's a Direct Channel*/
	@ManyToOne(() => UserEntity)
	owner2: UserEntity;

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

	@OneToOne(() => ChannelCredentialEntity, { cascade: true })
	@JoinColumn()
	credential: ChannelCredentialEntity;

	@ManyToMany(() => UserEntity)
	@JoinTable()
	adminList: UserEntity[];

	@ManyToMany(() => UserEntity)
	@JoinTable()
	userList: UserEntity[];

	@OneToMany(() => MessageEntity, (MessageEntity) => MessageEntity.channel)
	messages: MessageEntity[];

	@OneToMany(() => InviteEntity, (InviteEntity) => InviteEntity.channel)
	@JoinTable()
	inviteList: UserEntity[];
}
