import {IUserEntity} from './IUser.entity';
import {IChannelEntity} from './IChannel.entity';

export interface IMessageEntity {
	id: number;
	author: IUserEntity;
	sendTime: Date;
	channel: IChannelEntity;
	content: string;
}
