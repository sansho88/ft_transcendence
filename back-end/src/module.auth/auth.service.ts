import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import {UsersService} from '../module.users/users.service';
import {JwtService} from '@nestjs/jwt';
import {accessToken} from '../dto/payload';
import {UserCredentialService} from './credential.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private jwtService: JwtService,
		private credentialsService: UserCredentialService,
	) {
	}

	/** * * * * * * * * * * * * * * **/

	async logInVisit(login: string, rawPassword: string) {
		console.log(`NEW CONNECTION ===== \nlogin: ${login}\npass: ${rawPassword}`);
		if (login === undefined || rawPassword === undefined)
			throw new UnauthorizedException('Login or Password are empty');
		const user = await this.usersService
			.findAll()
			.then((users) => users[users.findIndex((usr) => usr.login == login)]);
		if (!user) {
			console.log(`Login failed :\`${login}' is not used`);
			throw new UnauthorizedException();
		}
		const credential = await this.usersService.getCredential(user.UserID);
		if (!(await this.credentialsService.compare(rawPassword, credential))) {
			console.log(`Login failed :Wrong password`);
			throw new UnauthorizedException();
		}
		console.log('Login success');
		const payloadToken: accessToken = {id: user.UserID};
		return await this.jwtService.signAsync(payloadToken);
	}

	async signInVisit(rawPassword: string) {
		const nbVisit = await this.usersService.findAll().then((value) => {
			return value.map(({visit}) => visit).length;
		});
		const login = 'user' + nbVisit;
		const userCredential = await this.credentialsService.create(rawPassword);
		const user = await this.usersService.create(login, true, userCredential);
		const payloadToken: accessToken = {id: user.UserID};
		return await this.jwtService.signAsync(payloadToken);
	}

	/** * * * * * * * * * * * * * * **/

	async signIn42(login: string, password: string) {
		throw new BadRequestException('WIP');
	}

	logIn42(login: string, password: string) {
		throw new BadRequestException('WIP');
	}
}
