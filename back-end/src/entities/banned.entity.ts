import {
	BaseEntity,
	Entity,
	JoinTable,
	ManyToOne,
	PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ChannelEntity } from './channel.entity';

@Entity('TestBanned')
export class BannedEntity extends BaseEntity {
	@PrimaryColumn()
	bannedID: number;

	@ManyToOne(() => UserEntity, (UserEntity) => UserEntity.banned)
	@JoinTable()
	user: UserEntity;

	@ManyToOne(() => ChannelEntity, (ChannelEntity) => ChannelEntity.bannedList)
	@JoinTable()
	channel: ChannelEntity;
}
