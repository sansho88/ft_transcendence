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
import {BannedEntity} from "../entities/banned.entity";
import {MuteEntity} from "../entities/mute.entity";
import {BannedService} from "./banned.service";
import {MutedService} from "./muted.service";
import {InviteService} from "./invite.service";
import {InviteEntity} from "../entities/invite.entity";

@Module({
	controllers: [ChannelController],
	imports: [
		TypeOrmModule.forFeature([
			ChannelCredentialEntity,
			ChannelEntity,
			MessageEntity,
			InviteEntity,
			BannedEntity,
			MuteEntity,
		]),
		forwardRef(() => UsersModule),
	],
	providers: [
		ChannelCredentialService,
		ChannelService,
		MessageService,
		InviteService,
		BannedService,
		MutedService,
		ChatGateway,
	],
	exports: [
		InviteService,
		ChatGateway,
	]
})
export class ChannelModule {
}