import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelEntity, ChannelType } from '../entities/channel.entity';
import { UsersService } from '../module.users/users.service';
import { UserEntity } from '../entities/user.entity';
import { ChannelCredentialEntity } from '../entities/credential.entity';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(ChannelEntity)
		private channelRepository: Repository<ChannelEntity>,
		private userService: UsersService,
	) {}

	async create(
		name: string,
		credential: ChannelCredentialEntity,
		protect: boolean,
		owner: UserEntity,
	) {
		// return 'wip';
		let privacy: ChannelType;
		if (protect == false) privacy = ChannelType.PUBLIC;
		else if (credential === undefined) privacy = ChannelType.PRIVATE;
		else privacy = ChannelType.PROTECTED;

		const chan = this.channelRepository.create({
			name: name,
			owner: owner,
			credential: credential,
			type: privacy,
		});
		await chan.save();
		// return 'DONE';
		return chan;
	}
	async findAll() {
		return this.channelRepository.find();
	}
}
