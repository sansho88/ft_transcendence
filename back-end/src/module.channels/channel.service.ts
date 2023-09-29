import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ChannelEntity, ChannelType} from '../entities/channel.entity';
import {UsersService} from '../module.users/users.service';
import {UserEntity} from '../entities/user.entity';
import {ChannelCredentialEntity} from '../entities/credential.entity';
import {ChannelCredentialService} from './credential.service';
import {JoinChannelDTOPipe} from '../dto.pipe/channel.dto';
import {BannedService} from "./banned.service";
import {MutedService} from "./muted.service";

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(ChannelEntity)
		private channelRepository: Repository<ChannelEntity>,
		private userService: UsersService,
		private channelCredentialService: ChannelCredentialService,
		private bannedService: BannedService,
		private mutedService: MutedService,
	) {
	}

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

	async findOne(id: number, relations?: string[]) {
		let channel;
		if (!relations)
			channel = await this.channelRepository.findOneBy({channelID: id});
		else
			channel = await this.channelRepository.findOne({
				where: {channelID: id},
				relations,
			});
		if (channel == null)
			throw new BadRequestException('this channel doesn\'t exist');
		return channel;
	}

	async joinChannel(user: UserEntity, channel: ChannelEntity) {
		this.getList(channel).then(async (lst) => {
			channel.userList = lst;
			channel.userList.push(user);
			await channel.save();
			return channel;
		});
	}

	async leaveChannel(channel: ChannelEntity, user: UserEntity) {
		const lst = await this.getList(channel)
		channel.userList = lst.filter(usr => usr.UserID != user.UserID)
		return await channel.save();
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
				where: {channelID: target.channelID},
				relations: {userList: true},
			})
			.then((chan) => chan.userList);
	}

	async isUserOnChan(channel: ChannelEntity, user: UserEntity) {
		const list = await this.getList(channel);
		return !!list.find((value) => value.UserID == user.UserID);
	}

	async getMessages(target: ChannelEntity, time: Date) {
		const msg = await this.channelRepository
			.findOne({
				where: {channelID: target.channelID},
				relations: ['messages', 'messages.author'],
			})
			.then((chan) => chan.messages);
		return msg.filter((msg) => time > msg.sendTime);
	}

	async getAllMessages(target: ChannelEntity) {
		const msg = await this.channelRepository
			.findOne({
				where: {channelID: target.channelID},
				relations: ['messages', 'messages.author'],
			})
			.then((chan) => chan.messages);
		return msg;
	}

	async checkCredential(data: JoinChannelDTOPipe) {
		const channel = await this.channelRepository.findOne({
			where: {channelID: data.channelID},
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

	userIsAdmin(user: UserEntity, channel: ChannelEntity) {
		const adminList = channel.adminList;
		return adminList.findIndex((value) => value.UserID == user.UserID) + 1;
	}

	async addAdmin(target: UserEntity, channel: ChannelEntity) {
		if (!(await this.userInChannel(target, channel)))
			throw new BadRequestException('The target isn\'t part of this Channel');
		channel = await this.channelRepository.findOne({
			where: {channelID: channel.channelID},
			relations: ['adminList'],
		});
		channel.adminList.push(target);
		await channel.save();
		return channel;
	}

	async removeAdmin(target: UserEntity, channel: ChannelEntity) {
		if (!(await this.userInChannel(target, channel)))
			throw new BadRequestException('The target isn\'t part of this Channel');
		if (target.UserID == channel.owner.UserID)
			throw new BadRequestException('The target is the ChannelOwner and cannot lost his Administrator Power');
		channel.adminList.findIndex(
			(usr) => usr.UserID == target.UserID,
		);
		channel.adminList = channel.adminList.filter((usr) => usr.UserID != target.UserID);
		await channel.save();
		return channel;
	}

	async banUser(target: UserEntity, channel: ChannelEntity, duration: number) {
		if (target.UserID == channel.owner.UserID)
			throw new BadRequestException('The target is the ChannelOwner and cannot be ban');
		if (await this.userIsBan(channel, target))
			throw new BadRequestException('The target is already banned and cannot be ban again');
		// if (await this.isUserOnChan(channel, target))
		// 	this.chatGateway.leave(channel, target);
		await this.bannedService.create(target, channel, duration);
	}

	async userIsBan(channel: ChannelEntity, usr: UserEntity) {
		return !!(await this.bannedService.findAll(channel).then(bans => {
			return bans.findIndex(ban => ban.user.UserID == usr.UserID)
		}) + 1)
	}

	async muteUser(target: UserEntity, channel: ChannelEntity, duration: number) {
		if (target.UserID == channel.owner.UserID)
			throw new BadRequestException('The target is the ChannelOwner and cannot be mute');
		if (await this.userIsMute(channel, target))
			throw new BadRequestException('The target is already mutes and cannot be mute again');
		await this.mutedService.create(target, channel, duration);
	}

	async userIsMute(channel: ChannelEntity, usr: UserEntity) {
		return !!(await this.mutedService.findAll(channel).then(mutes => {
			return mutes.findIndex(mute => mute.user.UserID == usr.UserID)
		}) + 1)
	}
}
