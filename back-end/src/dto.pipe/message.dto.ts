import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

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
	authorID: number;

	@IsString()
	@IsNotEmpty()
	content: string;
}
