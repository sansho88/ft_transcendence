import {IsNotEmpty, IsNumber, IsString, Max, Min} from 'class-validator';

export class SendMessageDTOPipe {
	@IsNumber()
	@Max(2147483647)
	@Min(0)
	@IsNotEmpty()
	channelID: number;

	@IsString()
	@IsNotEmpty()
	content: string;
}