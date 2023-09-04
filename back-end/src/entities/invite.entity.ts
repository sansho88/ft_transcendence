import {
	BaseEntity,
	Entity,
	JoinColumn,
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
	@JoinColumn()
	user: UserEntity;

	@ManyToOne(() => ChannelEntity)
	@JoinColumn()
	channel: ChannelEntity;
}
