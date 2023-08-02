import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../module.users/users.module';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { UserCredentialService } from './credential.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCredentialEntity } from '../entities/credential.entity';

@Module({
	imports: [
		JwtModule.register({
			global: true,
			secret: process.env.SECRET_KEY,
			signOptions: { expiresIn: '99d' },
		}),
		forwardRef(() => UsersModule),
		TypeOrmModule.forFeature([UserCredentialEntity]),
	],
	controllers: [AuthController],
	providers: [AuthService, UserCredentialService],
})
export class AuthModule {}
