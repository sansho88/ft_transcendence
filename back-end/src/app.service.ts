import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {UsersService} from "./module.users/users.service";
import {ChannelService} from "./module.channels/channel.service";
import {UserCredentialService} from "./module.auth/credential.service";
import {ChannelCredentialService} from "./module.channels/credential.service";
import {UserEntity} from "./entities/user.entity";

@Injectable()
export class AppService {

	constructor(
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService,
		@Inject(forwardRef(() => ChannelService))
		private readonly channelService: ChannelService,
		@Inject(forwardRef(() => UserCredentialService))
		private readonly userCredentialService: UserCredentialService,
		@Inject(forwardRef(() => ChannelCredentialService))
		private readonly channelCredentialService: ChannelCredentialService,
	) {
	}

	async createAdmin() {
		if (await this.usersService.getAdminUser())
			return;
		const credential = await this.userCredentialService.create('transcendence')
		return this.usersService.create('PongGod', false, credential);
	}

	async createGlobalChannel(admin: UserEntity) {
		if (await this.channelService.getGlobalChannel())
			return;
		const credential = await this.channelCredentialService.create(null);
		return this.channelService.create('GlobalChannel', credential, false, admin);
	}
}
