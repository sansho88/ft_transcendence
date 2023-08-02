import {
	BadRequestException,
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../module.users/users.service';
import { JwtService } from '@nestjs/jwt';
import { accessToken } from '../dto/payload';
import { CredentialService } from './credential.service';
import { UserStatus } from '../entities/user.entity';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private jwtService: JwtService,
		private credentialsService: CredentialService,
	) {}

	/** * * * * * * * * * * * * * * **/

	async logInVisit(login: string, rawPassword: string) {
		console.log(`NEW CONNECTION ===== \nlogin: ${login}\npass: ${rawPassword}`);
		if (login === undefined || rawPassword === undefined)
			throw new UnauthorizedException('Login or Password are empty');
		const user = await this.usersService.findOne(login);
		if (!user) {
			console.log('failed');
			throw new UnauthorizedException();
		}
		const credential = await this.usersService.getCredential(login);
		if (!(await this.credentialsService.compare(rawPassword, credential))) {
			console.log('failed');
			throw new UnauthorizedException();
		}
		console.log('success');
		const payloadToken: accessToken = { id: user.UserID, rawPassword };
		this.usersService.userStatus(login, UserStatus.ONLINE).then();
		return await this.jwtService.signAsync(payloadToken);
	}

	logIn(login: string, password: string) {
		throw new BadRequestException('WIP');
	}

	/** * * * * * * * * * * * * * * **/

	async signInVisit(login: string, rawPassword: string) {
		if (login === undefined || rawPassword === undefined)
			throw new UnauthorizedException('Login or Password are empty');
		login = login + '_g';
		if (login.length > 10) return new BadRequestException();
		if (await this.usersService.findOne(login))
			throw new ConflictException('login is already taken');
		const userCredential = await this.credentialsService.create(rawPassword);
		const user = await this.usersService.create(login, true, userCredential);
		const payloadToken: accessToken = { id: user.UserID, rawPassword };
		return await this.jwtService.signAsync(payloadToken);
	}

	async signIn(login: string, password: string) {
		throw new BadRequestException('WIP');
	}
}
