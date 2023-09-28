import {IsNotEmpty, IsNumber, IsString} from 'class-validator';
import {UserEntity} from "../entities/user.entity";
import {ChannelEntity} from "../entities/channel.entity";

export class SendMessageDTOPipe {
	@IsNumber()
	@IsNotEmpty()
	channelID: number;

	@IsString()
	@IsNotEmpty()
	content: string;
}

export class ReceivedMessageDTOPipe { // Todo: change UserID to UserEntity
	@IsNumber()
	@IsNotEmpty()
	channelID: number;

	@IsNumber()
	@IsNotEmpty()
	author: UserEntity;

	@IsString()
	@IsNotEmpty()
	content: string;
}

export class JoinEventDTOPipe {
	@IsNumber()
	@IsNotEmpty()
	channelID: number;

	@IsString()
	@IsNotEmpty()
	user: UserEntity;
}

export class LeaveEventDTOPipe {
	@IsNumber()
	@IsNotEmpty()
	channelID: number;

	@IsNumber()
	@IsNotEmpty()
	user: UserEntity;
}