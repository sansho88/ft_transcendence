import { forwardRef, Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from '../entities/channel.entity';
import { ChannelCredentialEntity } from '../entities/credential.entity';
import { UsersModule } from '../module.users/users.module';
import { ChannelCredentialService } from './credential.service';
import { ChatGateway } from './chat.ws';
import { MessageService } from './message.service';
import { MessageEntity } from '../entities/message.entity';
import {forwardRef, Module} from '@nestjs/common';
import {ChannelService} from './channel.service';
import {ChannelController} from './channel.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ChannelEntity} from '../entities/channel.entity';
import {ChannelCredentialEntity} from '../entities/credential.entity';
import {UsersModule} from '../module.users/users.module';
import {ChannelCredentialService} from './credential.service';
import {ChatGateway} from './chat.ws';
import {MessageService} from './message.service';
import {MessageEntity} from '../entities/message.entity';

@Module({
	controllers: [ChannelController],
	imports: [
		TypeOrmModule.forFeature([
			ChannelCredentialEntity,
			ChannelEntity,
			MessageEntity,
		]),
		forwardRef(() => UsersModule),
	],
	providers: [
		ChannelService,
		ChannelCredentialService,
		ChatGateway,
		MessageService,
	],
})
export class ChannelModule {
}