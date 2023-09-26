import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import {UserEntity} from './user.entity';
import {ChannelEntity} from './channel.entity';

@Entity('TestMute')
export class MuteEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	muteID: number;

	@ManyToOne(() => UserEntity, (UserEntity) => UserEntity.mute, {eager: true})
	@JoinColumn()
	user: UserEntity;

	@ManyToOne(() => ChannelEntity, (ChannelEntity) => ChannelEntity.muteList, {eager: true})
	@JoinColumn()
	channel: ChannelEntity;

	@Column({
		nullable: true,
		type: `timestamp`,
	})
	endTime: Date;
}
