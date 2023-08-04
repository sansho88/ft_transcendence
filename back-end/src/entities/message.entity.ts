import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	Timestamp,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ChannelEntity } from './channel.entity';

@Entity('TestMessages')
export class MessageEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => UserEntity, (UserEntity) => UserEntity.message)
	author: UserEntity;

	@Column({
		type: 'timestamp',
	})
	sendTime: Timestamp;

	@ManyToOne(() => ChannelEntity, (ChannelEntity) => ChannelEntity.messages)
	channel: ChannelEntity;

	@Column({
		type: 'varchar',
		length: 256,
		nullable: false,
	})
	content: string;
}
