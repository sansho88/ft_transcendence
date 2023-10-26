import {IUserEntity} from './IUser.entity';
import {IChannelEntity} from './IChannel.entity';

export interface IBannedEntity {
	bannedID: number;
	user: IUserEntity;
	channel: IChannelEntity;
	endTime: Date;
}
