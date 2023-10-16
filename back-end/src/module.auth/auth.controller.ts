import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	ValidationPipe,
	Req,
	UseGuards,
	Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogVisitDTOPipe, SignVisitDTOPipe } from '../dto.pipe/auth/visit';
import { Request } from 'express';
import { UserEntity } from 'src/entities/user.entity';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from './indentify.user';

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
	logVisitIn(
		@Body(new ValidationPipe()) loginDto: LogVisitDTOPipe,
		@Param('2faToken') token: string) {
		return this.authService.logInVisit(loginDto.login, loginDto.password, loginDto.token_2fa);
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
	@Post('42/connect/:2faToken')
	connect42(
		@Param('2faToken') token: string,
		@Body()body : string,
		@Req() req: Request) {
		return this.authService.connect42(Object.keys(body)[0], req, token);
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Post('2fa/generate')
	generate2FA(@CurrentUser() user: UserEntity) {
		return this.authService.generate2FA(user);
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Post('2fa/check/:2faToken')
	check2FA(
		@CurrentUser() user: UserEntity, 
		@Param('2faToken') token: string) {
		return this.authService.check2FA(token, user);
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Post('2fa/disable/:2faToken')
	disable2FA(
		@CurrentUser() user: UserEntity,
		@Param('2faToken') token: string) {
		return this.authService.disable2FA(token, user);
	}
}
