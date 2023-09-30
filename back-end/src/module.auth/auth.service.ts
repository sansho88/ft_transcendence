import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../module.users/users.service';
import { JwtService } from '@nestjs/jwt';
import { accessToken } from '../dto/payload';
import { UserCredentialService } from './credential.service';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
	nbVisit = 0;

	constructor(
		private readonly usersService: UsersService,
		private jwtService: JwtService,
		private credentialsService: UserCredentialService,
	) { }

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
		const payloadToken: accessToken = { id: user.UserID };
		return await this.jwtService.signAsync(payloadToken);
	}

	async signInVisit(rawPassword: string) {
		this.nbVisit++;
		const login = 'user' + this.nbVisit;
		const userCredential = await this.credentialsService.create(rawPassword);
		const user = await this.usersService.create(login, true, userCredential);
		const payloadToken: accessToken = { id: user.UserID };
		return await this.jwtService.signAsync(payloadToken);
	}

	/** * * * * * * * * * * * * * * **/

	getClientID() {
		return process.env.CLIENT_ID;
	}

	async connect42(token: string) {
		const axios = require('axios');

		const tokenRequestData = {
			grant_type: 'authorization_code',
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
			code: token,
			redirect_uri: "http://localhost:3000/callback",
		};
		let request = await axios.post('https://api.intra.42.fr/oauth/token', tokenRequestData)
			.then(async (response) => {
				if (response.status !== 200)
					throw new HttpException(response.data.error + " / ERROR INTRA TOKEN", response.status);
				const headers = {
					Authorization: `${response.data.token_type} ${response.data.access_token}`,
				}
				try {
					return await axios.get('https://api.intra.42.fr/v2/me', { headers, });
				}
				catch (error) {
					console.log(error);
					throw new HttpException(error.message + " / ERROR INTRA TOKEN (/me)", response.status);
				}
			})
			.catch(async (error) => {
				console.log(error);
				throw new HttpException(error.message + " / ERROR INTRA TOKEN", HttpStatus.UNAUTHORIZED);
			});
		const login = request.data.login;
		const user = await this.usersService.findOne((login));
		// null = sign in
		if (user === null) {
			const userCredential = await this.credentialsService.create("");
			let newUser = await this.usersService.create(login, true, userCredential);
			if (request.data.image.link)
			{
				newUser.avatar_path = request.data.image.link;
				await newUser.save();
			}
			const payloadToken: accessToken = { id: newUser.UserID };
			return await this.jwtService.signAsync(payloadToken);
		}
		// else login
		if (!user) {
			console.log('failed');
			throw new UnauthorizedException();
		}
		const credential = await this.usersService.getCredential(login);
		if (!(await this.credentialsService.compare("", credential))) {
			console.log('failed');
			throw new UnauthorizedException();
		}
		console.log('success');
		const payloadToken: accessToken = { id: user.UserID };
		return await this.jwtService.signAsync(payloadToken);
	}
}