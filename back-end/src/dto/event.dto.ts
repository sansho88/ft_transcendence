import {IsNotEmpty, IsNumber, IsObject, IsString} from "class-validator";
import {UserEntity} from "../entities/user.entity";
import {InviteEntity} from "../entities/invite.entity";
import {ChannelEntity} from "../entities/channel.entity";

export class JoinEventDTO {
	@IsNumber()
	@IsNotEmpty()
	channelID: number;

	@IsObject()
	@IsNotEmpty()
	user: UserEntity;
}

export class LeaveEventDTO {
	@IsNumber()
	@IsNotEmpty()
	channelID: number;

	@IsObject()
	@IsNotEmpty()
	user: UserEntity;
}

export class ReceivedMessageEventDTO {
	@IsNumber()
	@IsNotEmpty()
	channelID: number;

	@IsObject()
	@IsNotEmpty()
	author: UserEntity;

	@IsString()
	@IsNotEmpty()
	content: string;
}

class EventNotif {
	type: string;
}

export class ReceivedInviteEventDTO extends EventNotif {
	invite: InviteEntity;
}

export class BannedEventDTO extends EventNotif {
	user: UserEntity;
	duration: number;
	channel: ChannelEntity;
}

export class KickedEventDTO extends EventNotif {
	user: UserEntity;
	channel: ChannelEntity;
}

export class MutedEventDTO extends EventNotif {
	user: UserEntity;
	duration: number;
	channel: ChannelEntity;
}
