import {
	BaseEntity,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { MessageEntity } from './message.entity';

@Entity('TestChannels')
export class ChannelEntity extends BaseEntity {
	@PrimaryColumn()
	ID: number;

	@ManyToOne(() => UserEntity)
	owner: UserEntity;

	@OneToMany(() => MessageEntity, (MessageEntity) => MessageEntity.channel)
	messages: MessageEntity[];
}
