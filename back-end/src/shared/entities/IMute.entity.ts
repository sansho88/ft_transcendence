import {IUserEntity} from './IUser.entity';
import {IChannelEntity} from './IChannel.entity';

export interface IMuteEntity {
	muteID: number;
	user: IUserEntity;
	channel: IChannelEntity;
	endTime: Date;
}
