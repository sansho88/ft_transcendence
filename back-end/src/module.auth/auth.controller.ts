import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogVisitDTOPipe, SignVisitDTOPipe } from '../dto.pipe/auth/visit';
import { connect42DTO } from '../dto.pipe/auth/42';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@HttpCode(HttpStatus.OK)
	@Post('visit/sign')
	signVisitIn(@Body(new ValidationPipe()) signDto: SignVisitDTOPipe) {
		return this.authService.signInVisit(signDto.password);
	}

	@HttpCode(HttpStatus.OK)
	@Post('visit/login')
	logVisitIn(@Body(new ValidationPipe()) loginDto: LogVisitDTOPipe) {
		return this.authService.logInVisit(loginDto.login, loginDto.password);
	}

	// /**************************************/
	//            42 Authentication
	// /**************************************/

	@HttpCode(HttpStatus.OK)
	@Post('42/connect')
	connect42(/*@Body(new ValidationPipe()) signDto: connect42DTO*/@Body()body) {
		console.log(body);
		return this.authService.connect42(Object.keys(body)[0]);
	}
}
