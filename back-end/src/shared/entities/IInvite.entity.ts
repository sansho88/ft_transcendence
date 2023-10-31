import {IUserEntity} from './IUser.entity';
import {IChannelEntity} from './IChannel.entity';
import { IUser } from '../types';
import { IChannel } from '../typesChannel';

export interface IInviteEntity {
	inviteID: number;
	user: IUser;
	channel: IChannel;
	sender: IUser;
}
