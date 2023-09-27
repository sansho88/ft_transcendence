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
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { UsersService } from '../module.users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private usersService: UsersService,
	) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			throw new UnauthorizedException('No token');
		}
		let payloadToken: accessToken;
		try {
			payloadToken = await this.jwtService.verifyAsync(token, {
				secret: process.env.SECRET_KEY,
			});
		} catch {
			throw new UnauthorizedException('Bad token');
		}
		const user = await this.getUser(payloadToken);
		if (user == null) throw new UnauthorizedException();
		request['user'] = user;
		return true;
	}

	private async getUser(payloadToken: accessToken) {
		return await this.usersService.findOne(payloadToken.id).catch(() => null);
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}

@Injectable()
export class WSAuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private usersService: UsersService,
	) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToWs().getClient();
		const token = this.extractTokenFromHeaderWS(request);
		if (!token) {
			throw new WsException('No token');
		}
		let payloadToken: accessToken;
		try {
			payloadToken = await this.jwtService.verifyAsync(token, {
				secret: process.env.SECRET_KEY,
			});
		} catch {
			throw new WsException('Bad token');
		}
		const user = await this.getUser(payloadToken);
		if (user == null) return false;
		request['user'] = user;
		return true;
	}

	private async getUser(payloadToken: accessToken) {
		return await this.usersService.findOne(payloadToken.id).catch(() => null);
	}
	private extractTokenFromHeaderWS(client: Socket): string | undefined {
		const [type, token] =
			client.handshake.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
