import { IsNotEmpty, IsString } from 'class-validator';

export class LogVisitDTOPipe {
	@IsString()
	@IsNotEmpty()
	login: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}

export class SignVisitDTOPipe {
	@IsString()
	@IsNotEmpty()
	password: string;
}
