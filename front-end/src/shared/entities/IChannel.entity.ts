import {IUserEntity} from './IUser.entity';
import {IMessageEntity} from './IMessage.entity';
import {IChannelCredentialEntity} from './ICredential.entity';
import {IInviteEntity} from './IInvite.entity';
import {IMuteEntity} from './IMute.entity';
import {IBannedEntity} from './IBanned.entity';

export enum ChannelType {
	PUBLIC, //No password No Privacy
	PROTECTED, //Yes Password No Privacy
	PRIVATE, //Maybe password Yes Privacy
	DIRECT,
}

export interface IChannelEntity {
	channelID: number;
	owner: IUserEntity;
	name: string;
	type: ChannelType;
}
