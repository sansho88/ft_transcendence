import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { logInDto } from '../dto/auth/log-auth.dto';
import { signInDto } from '../dto/auth/sign-auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@HttpCode(HttpStatus.OK)
	@Post('sign')
	signIn(@Body() signDto: signInDto) {
		if (signDto.visit === true)
			return this.authService.signInVisit(signDto.login, signDto.password);
		else return this.authService.signIn(signDto.login, signDto.password);
	}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	logIn(@Body() loginDto: logInDto) {
		if (loginDto.visit === true)
			return this.authService.logInVisit(loginDto.login, loginDto.password);
		else return this.authService.logIn(loginDto.login, loginDto.password);
	}
}
