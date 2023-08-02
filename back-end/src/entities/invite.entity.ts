import {
	BaseEntity,
	Entity,
	ManyToOne,
	PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ChannelEntity } from './channel.entity';

@Entity('TestInvites')
export class InviteEntity extends BaseEntity {
	@PrimaryColumn()
	inviteID: number;

	@ManyToOne(() => UserEntity)
	user: UserEntity;

	@ManyToOne(() => ChannelEntity)
	channel: ChannelEntity;
}
