import {
	BaseEntity,
	Entity,
	ManyToOne,
	PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ChannelEntity } from './channel.entity';

@Entity('TestBanned')
export class BannedEntity extends BaseEntity {
	@PrimaryColumn()
	bannedID: number;

	@ManyToOne(() => UserEntity)
	user: UserEntity;

	@ManyToOne(() => ChannelEntity)
	channel: ChannelEntity;
}
