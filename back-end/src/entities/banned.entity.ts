import {
	BaseEntity,
	Column,
	Entity,
	JoinTable,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import {UserEntity} from './user.entity';
import {ChannelEntity} from './channel.entity';

@Entity('TestBanned')
export class BannedEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	bannedID: number;

	@ManyToOne(() => UserEntity, (UserEntity) => UserEntity.banned, {eager: true})
	@JoinTable()
	user: UserEntity;

	@ManyToOne(() => ChannelEntity, (ChannelEntity) => ChannelEntity.bannedList, {eager: true})
	@JoinTable()
	channel: ChannelEntity;

	@Column({
		nullable: true,
		type: `timestamp`,
	})
	endTime: Date;
}
