import {
	BaseEntity,
	Entity,
	ManyToOne,
	PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ChannelEntity } from './channel.entity';

@Entity('TestMute')
export class MuteEntity extends BaseEntity {
	@PrimaryColumn()
	muteID: number;

	@ManyToOne(() => UserEntity)
	user: UserEntity;

	@ManyToOne(() => ChannelEntity)
	channel: ChannelEntity;
}
