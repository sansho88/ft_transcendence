import {IsNotEmpty, IsNumber, IsString, Length, Max, Min} from 'class-validator';

export class SendMessageDTOPipe {
	@IsNumber()
	@Max(2147483647)
	@Min(0)
	@IsNotEmpty()
	channelID: number;

	@IsString()
	@IsNotEmpty()
	@Length(0, 140)
	content: string;
}