import {
	IsBoolean,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Length,
	Max,
	Min,
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
	@Max(2147483647)
	@Min(0)
	@IsNotEmpty()
	channelID: number;

	@IsString()
	@IsOptional()
	password?: string;
}

export class LeaveChannelDTOPipe {
	@IsNumber()
	@Max(2147483647)
	@Min(0)
	@IsNotEmpty()
	channelID: number;
}

export class CreateMpDTOPPipe {
	@IsNotEmpty()
	@Max(2147483647)
	@Min(0)
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