import {
	BaseEntity,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import {UserEntity} from './user.entity';
import {ChannelEntity} from './channel.entity';

@Entity('TestInvites')
export class InviteEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	inviteID: number;

	@ManyToOne(() => UserEntity)
	@JoinColumn()
	user: UserEntity;

	@ManyToOne(() => ChannelEntity)
	@JoinColumn()
	channel: ChannelEntity;

	@ManyToOne(() => UserEntity)
	@JoinColumn()
	sender: UserEntity;
}
