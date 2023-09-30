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
		const tokenInfo = getToken(client);
		const type = tokenInfo.type;
		const token = tokenInfo.token;
		console.log('token=' + token)
		return type === 'Bearer' ? token : undefined;
	}
}

//compromis pour utiliser a la fois auth via header pour POSTMAN et handshake.auth pour le front
export function getToken(client: Socket): { type: string, token: string } {
	if (client.handshake.auth.type === 'Bearer') {
		console.log('CHECK POINT 1');
		return { type: client.handshake.auth.type, token: client.handshake.auth.token }
	}
	else {
		console.log('CHECK POINT 2');
		const [type, token] =
		client.handshake.headers.authorization?.split(' ') ?? [];
		console.log('CHECK POINT 2b');
		// return type === 'Bearer' ? {type: type, token: token } : undefined;
		console.log('CHECK POINT 2c');
		if (type === 'Bearer') {
			if (token !== undefined) {
				
				console.log('CHECK POINT 3');
				return { type: type, token: token };
			}
			else {
				console.log('CHECK POINT 4');
				throw new WsException('No token');
			}
		}
		else {
			console.log('CHECK POINT 4');
			throw new WsException('No token');
		}
	}
}
