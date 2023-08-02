import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as process from 'process';
import { UsersModule } from './module.users/users.module';
import { AuthModule } from './module.auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ChannelEntity } from './entities/channel.entity';
import { MessageEntity } from './entities/message.entity';
import {
	ChannelCredentialEntity,
	UserCredentialEntity,
} from './entities/credential.entity';
import { GameEntity } from './entities/game.entity';
import { ChannelModule } from './module.channels/channel.module';
import { InviteEntity } from './entities/invite.entity';
import { MuteEntity } from './entities/mute.entity';
import { BannedEntity } from './entities/banned.entity';

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: true,
			isGlobal: true,
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.POSTGRES_HOST,
			port: parseInt(process.env.POSTGRES_PORT) || 5432,
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
			entities: [
				UserEntity,
				ChannelEntity,
				MessageEntity,
				InviteEntity,
				MuteEntity,
				BannedEntity,
				UserCredentialEntity,
				ChannelCredentialEntity,
				GameEntity,
			],
			synchronize: true, // true -> will create the Table on db if class not there
		}),
		UsersModule,
		AuthModule,
		ChannelModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
