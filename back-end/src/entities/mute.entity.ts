import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
} from 'typeorm';
import {UserEntity} from './user.entity';
import {ChannelEntity} from './channel.entity';

@Entity('TestMute')
export class MuteEntity extends BaseEntity {
	@PrimaryColumn()
	muteID: number;

	@ManyToOne(() => UserEntity, (UserEntity) => UserEntity.mute)
	@JoinColumn()
	user: UserEntity;

	@ManyToOne(() => ChannelEntity, (ChannelEntity) => ChannelEntity.muteList)
	@JoinColumn()
	channel: ChannelEntity;

	@Column({
		nullable: true,
		type: `timestamp`,
	})
	endTime: Date;
}
