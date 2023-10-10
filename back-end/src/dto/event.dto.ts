import {IsNotEmpty, IsNumber, IsObject, IsString} from "class-validator";
import {UserEntity} from "../entities/user.entity";

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
