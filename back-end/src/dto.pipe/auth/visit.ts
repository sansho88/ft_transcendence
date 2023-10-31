import {IsNotEmpty, IsOptional, IsString, Length} from 'class-validator';

export class LogVisitDTOPipe {
	@IsString()
	@IsNotEmpty()
	login: string;

	@IsString()
	@IsNotEmpty()
	@Length(0,20)
	password: string;

	@IsString()
	@IsOptional()
	token_2fa?: string;
}

export class SignVisitDTOPipe {
	@IsString()
	@IsNotEmpty()
	@Length(0,20)
	password: string;
}
