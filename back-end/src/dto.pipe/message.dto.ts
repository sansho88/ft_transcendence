import {IsNotEmpty, IsNumber, IsString} from 'class-validator';
import {UserEntity} from "../entities/user.entity";

export class SendMessageDTOPipe {
	@IsNumber()
	@IsNotEmpty()
	channelID: number;

	@IsString()
	@IsNotEmpty()
	content: string;
}

export class ReceivedMessageDTOPipe {
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