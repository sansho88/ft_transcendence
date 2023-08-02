import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelEntity } from '../entities/channel.entity';
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
		owner: UserEntity,
		credential: ChannelCredentialEntity,
	) {
		const chan = this.channelRepository.create({
			name: name,
			owner: owner,
			credential: credential,
		});
		await chan.save();
		return chan;
	}
	async findAll(){
		return this.channelRepository.find();
	}
}
