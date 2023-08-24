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
	id: number;

	@IsString()
	@IsOptional()
	password?: string;
}
