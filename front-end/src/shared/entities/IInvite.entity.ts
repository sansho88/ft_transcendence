import {IUserEntity} from './IUser.entity';
import {IChannelEntity} from './IChannel.entity';

export interface IInviteEntity {
	inviteID: number;
	user: IUserEntity;
	channel: IChannelEntity;
	sender: IUserEntity;
}
