import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';
import { Request } from 'express';
import { accessToken } from '../dto/payload';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext) {
		console.log(' === IN CANACTIVATE ==== ');
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			console.log('NOT TOKEN');
			throw new UnauthorizedException();
		}
		try {
			const payloadToken: accessToken = await this.jwtService.verifyAsync(
				token,
				{
					secret: process.env.SECRET_KEY,
				},
			);
			console.log(payloadToken);
			request['user'] = payloadToken;
		} catch {
			console.log('false catch');
			throw new UnauthorizedException();
		}
		console.log('true');
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
