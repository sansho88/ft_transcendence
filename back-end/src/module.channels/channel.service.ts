import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Timestamp } from 'typeorm';
import { ChannelEntity, ChannelType } from '../entities/channel.entity';
import { UsersService } from '../module.users/users.service';
import { UserEntity } from '../entities/user.entity';
import { ChannelCredentialEntity } from '../entities/credential.entity';
import { ChannelCredentialService } from './credential.service';
import { JoinChannelDTOPipe } from '../dto.pipe/channel.dto';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(ChannelEntity)
		private channelRepository: Repository<ChannelEntity>,
		private userService: UsersService,
		private channelCredentialService: ChannelCredentialService,
	) {}

	async create(
		name: string,
		credential: ChannelCredentialEntity,
		prv: boolean,
		owner: UserEntity,
	) {
		/*
				PUBLIC = not private / no password
				Protected = Not Private / Password
				Private = Private / ? Password
		 */
		let privacy: ChannelType;
		if (prv == true) privacy = ChannelType.PRIVATE;
		else if (credential.password != null) privacy = ChannelType.PROTECTED;
		else privacy = ChannelType.PUBLIC;
		const chan = this.channelRepository.create({
			name: name,
			owner: owner,
			type: privacy,
			userList: [owner],
			adminList: [owner],
		});
		chan.credential = credential;
		await chan.save();
		return chan;
	}

	async findAll() {
		return this.channelRepository.find();
	}

	async findOne(id: number | string) {
		if (typeof id === 'number')
			return await this.channelRepository.findOneBy({ channelID: id });
		return await this.channelRepository.findOneBy({ name: id });
	}

	async joinChannel(user: UserEntity, chan: ChannelEntity) {
		this.getList(chan).then(async (lst) => {
			chan.userList = lst;
			chan.userList.push(user);
			await chan.save();
			return chan;
		});
	}

	/**
	 * return true if User in channel
	 * @param user
	 * @param chan
	 */
	async userInChannel(user: UserEntity, chan: ChannelEntity) {
		return this.getList(chan).then((userList) => {
			return userList.find((usr) => usr.UserID == user.UserID);
		});
	}

	async getList(target: ChannelEntity) {
		return this.channelRepository
			.findOne({
				where: { channelID: target.channelID },
				relations: { userList: true },
			})
			.then((chan) => chan.userList);
	}

	async isUserOnChan(channel: ChannelEntity, user: UserEntity) {
		const list = await this.getList(channel);
		console.log('list get');
		return !!list.find((value) => value.UserID == user.UserID);
	}

	/**
	 * TODO : TESTER LA FONCTION !!!
	 * Je n ai pas encore regarder si ca fonctionne correctement
	 *
	 * Peut aussi etre Fais avec `take` et `skip` option pour find
	 * */
	async getMessages(target: ChannelEntity, time: Timestamp) {
		const msg = await this.channelRepository
			.findOne({
				where: { channelID: target.channelID },
				relations: { messages: true },
			})
			.then((chan) => chan.messages);
		let i = 0;
		const first = msg.findIndex((msg) => msg.sendTime > time);
		console.log(`first = ${first}`);
		const last = msg.findIndex((msg) => {
			if (msg.sendTime > time) {
				if (i > 49) return true;
				i++;
				return false;
			}
		});
		console.log(`last = ${last}`);
		return msg.slice(first, last);
	}

	async checkCredential(data: JoinChannelDTOPipe) {
		const channel = await this.channelRepository.findOne({
			where: { channelID: data.id },
			relations: ['credential'],
		});
		const credential = channel.credential;
		switch (channel.type) {
			case ChannelType.PUBLIC:
				return true;
			case ChannelType.PROTECTED:
				return this.channelCredentialService.compare(data.password, credential);
			case ChannelType.PRIVATE:
				return false; // todo: redo with invite !
			case ChannelType.DIRECT:
				return false; // todo: WIP
		}
	}
}
