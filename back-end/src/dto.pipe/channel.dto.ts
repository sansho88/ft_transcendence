import {
	IsBoolean,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Length,
} from 'class-validator';

export class CreateChannelDTOPipe {
	@IsString()
	@IsNotEmpty()
	@Length(3, 20)
	name: string;

	@IsBoolean()
	@IsNotEmpty()
	privacy: boolean;

	@IsString()
	@IsOptional()
	password?: string;
}

export class JoinChannelDTOPipe {
	@IsNumber()
	@IsNotEmpty()
	channelID: number;

	@IsString()
	@IsOptional()
	password?: string;
}

export class LeaveChannelDTOPipe {
	@IsNumber()
	@IsNotEmpty()
	channelID: number;
}

export class CreateMpDTOPPipe {
	@IsNotEmpty()
	@IsNumber()
	targetID: number
}

export class ChangeChannelDTOPipe {
	@IsOptional()
	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	password: string;

	@IsOptional()
	@IsBoolean()
	privacy: boolean;
}

export class CreateChallengeDTOPPipe {
	@IsNumber()
	@IsNotEmpty()
	targetID: number
}