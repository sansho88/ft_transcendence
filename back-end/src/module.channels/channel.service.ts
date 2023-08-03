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
			userList: [owner],
		});
		await chan.save();
		// return 'DONE';
		return chan;
	}
	async findAll() {
		return this.channelRepository.find();
	}

	async findOne(id: number) {
		return this.channelRepository.findOne({
			where: {
				channelID: id,
			},
		});
	}

	async joinChannel(user: UserEntity, chan: ChannelEntity) {
		this.getList(chan).then(async (lst) => {
			chan.userList = lst;
			chan.userList.push(user);
			await chan.save();
			return chan;
		});
	}

	async userInChannel(user: UserEntity, chan: ChannelEntity) {
		return this.getList(chan).then((userList) => {
			console.log(userList);
			return userList.find((usr) => usr.UserID == user.UserID);
		});
	}

	async getList(target: ChannelEntity) {
		return this.channelRepository
			.findOne({
				where: {
					channelID: target.channelID,
				},
				relations: {
					userList: true,
				},
			})
			.then((chan) => chan.userList);
	}
}
