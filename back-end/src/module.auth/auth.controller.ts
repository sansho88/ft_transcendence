import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	ValidationPipe,
	Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogVisitDTOPipe, SignVisitDTOPipe } from '../dto.pipe/auth/visit';
import { Request } from 'express';

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
	@Post('42/getIntraURL')
	getIntraUrl(@Req() req: Request) {
		return this.authService.getIntraURL(req);
	}

	@HttpCode(HttpStatus.OK)
	@Post('42/connect')
	connect42(@Body()body : string, @Req() req: Request) {
		return this.authService.connect42(Object.keys(body)[0], req);
	}
}
