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
import { Log42DTOPipe, Sign42DTOPipe } from '../dto.pipe/auth/42';

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
	// Todo : 42 Authentication
	// /**************************************/
	@HttpCode(HttpStatus.OK)
	@Post('42/sign')
	sign42In(@Body(new ValidationPipe()) signDto: Sign42DTOPipe) {
		return this.authService.signIn42(signDto.login, signDto.password);
	}

	@HttpCode(HttpStatus.OK)
	@Post('42/login')
	log42In(@Body(new ValidationPipe()) loginDto: Log42DTOPipe) {
		return this.authService.logIn42(loginDto.login, loginDto.password);
	}
}
