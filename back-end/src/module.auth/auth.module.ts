import {forwardRef, Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UsersModule} from '../module.users/users.module';
import {JwtModule} from '@nestjs/jwt';
import * as process from 'process';
import {UserCredentialService} from './credential.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserCredentialEntity} from '../entities/credential.entity';
import {ChannelModule} from "../module.channels/channel.module";

@Module({
	imports: [
		JwtModule.register({
			global: true,
			secret: process.env.SECRET_KEY,
			signOptions: {expiresIn: '99d'},
		}),
		forwardRef(() => UsersModule),
		forwardRef(() => ChannelModule),
		TypeOrmModule.forFeature([UserCredentialEntity]),
	],
	controllers: [AuthController],
	providers: [AuthService, UserCredentialService],
	exports: [UserCredentialService],
})
export class AuthModule {
}
