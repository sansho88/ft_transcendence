import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LogVisitDTOPipe {
	@IsString()
	@IsNotEmpty()
	login: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsString()
	@IsOptional()
	token_2fa?: string;
}

export class SignVisitDTOPipe {
	@IsString()
	@IsNotEmpty()
	password: string;
}
