import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ChannelEntity, ChannelType} from '../entities/channel.entity';
import {UsersService} from '../module.users/users.service';
import {UserEntity} from '../entities/user.entity';
import {ChannelCredentialEntity} from '../entities/credential.entity';
import {ChannelCredentialService} from './credential.service';
import {ChangeChannelDTOPipe, JoinChannelDTOPipe} from '../dto.pipe/channel.dto';
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
			mp: false,
		});
		chan.credential = credential;
		await chan.save();
		return chan;
	}

	async findAll(relations?: string[]) {
		return this.channelRepository.find({relations, where: {archive: false}});
	}

	async findOne(id: number, relations?: string[], canBeMP?: boolean) {
		let channel: ChannelEntity;
		if (canBeMP != true)
			channel = await this.channelRepository.findOne({
				where: {channelID: id, mp: false, archive: false},
				relations,
			});
		else
			channel = await this.channelRepository.findOne({
				where: {channelID: id, archive: false},
				relations,
			});
		if (channel == null)
			throw new BadRequestException('This channel doesn\'t exist');
		return channel;
	}

	async joinChannel(user: UserEntity, channel: ChannelEntity) {
		channel.userList.push(user);
		await channel.save();
		return channel;
	}

	async leaveChannel(channel: ChannelEntity, user: UserEntity) {
		console.log('LeaveChannel ===')
		channel.userList = channel.userList.filter(usr => usr.UserID != user.UserID)
		return await channel.save();
	}

	/**
	 * return true if User in channel
	 */
	async userInChannel(user: UserEntity, channel: ChannelEntity) {
		return channel.userList.find(usr => usr.UserID == user.UserID);
	}

	async isUserOnChan(channel: ChannelEntity, user: UserEntity) {
		return !!channel.userList.find((value) => value.UserID == user.UserID);
	}

	async getMessages(target: ChannelEntity) {
		return this.channelRepository
			.findOne({
				where: {channelID: target.channelID, archive: false},
				relations: ['messages', 'messages.author'],
			}).then((chan) => chan.messages);
	}

	async getAllMessages(target: ChannelEntity) {
		return await this.channelRepository
			.findOne({
				where: {channelID: target.channelID, archive: false},
				relations: ['messages', 'messages.author'],
			})
			.then((chan) => chan.messages);
	}

	async checkCredential(data: JoinChannelDTOPipe) {
		const channel = await this.channelRepository.findOne({
			where: {channelID: data.channelID, mp: false, archive: false},
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
			where: {channelID: channel.channelID, mp: false, archive: false},
			relations: ['adminList'],
		});
		channel.adminList.push(target);
		await channel.save();
		return channel;
	}

	async removeAdmin(target: UserEntity, channel: ChannelEntity) {
		if (!(await this.userInChannel(target, channel)))
			throw new BadRequestException('The target isn\'t part of this Channel');
		// if (target.UserID == channel.owner.UserID)
		// 	throw new BadRequestException('The target is the ChannelOwner and cannot lost his Administrator Power');
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


	async createMP(user1: UserEntity, user2: UserEntity) {
		const id1: number = Math.min(user1.UserID, user2.UserID);
		const id2: number = Math.max(user1.UserID, user2.UserID);
		const mp = this.channelRepository.create({
			name: `mp.${id1}.${id2}`,
			userList: [user1, user2],
			type: ChannelType.DIRECT,
			mp: true,
		})
		await mp.save();
		return mp;
	}

	async getmp(user1: UserEntity, user2: UserEntity) {
		const id1: number = Math.min(user1.UserID, user2.UserID);
		const id2: number = Math.max(user1.UserID, user2.UserID);
		const channel = await this.channelRepository.findOne({
			where: {mp: true, name: `mp.${id1}.${id2}`, archive: false},
			relations: ['userList'],
		});
		if (!channel)
			throw new BadRequestException('this channel doesn\'t exist')
		return channel;
	}

	async modifyChannel(channel: ChannelEntity, credential: ChannelCredentialEntity, data: ChangeChannelDTOPipe) {
		let privacy: ChannelType = channel.type;
		if (typeof data.privacy !== 'undefined') {
			if (data.privacy == true)
				privacy = ChannelType.PRIVATE;
			else if (credential.password != null) privacy = ChannelType.PROTECTED;
			else privacy = ChannelType.PUBLIC;
		}
		channel.type = privacy;
		if (data.name)
			channel.name = data.name;
		channel.credential = credential;
		return channel.save();
	}

	async getJoinedChannelList(user: UserEntity) {
		const ret = await this.userService.findOne(user.UserID, ['channelJoined']);
		return ret.channelJoined;
	}

	async remove(channel: ChannelEntity) {
		channel.archive = true;
		await channel.save();
		return channel;
	}

	async checkBlock(user: UserEntity, channel: ChannelEntity) {
		const targetID = channel.userList.find(usr => usr.UserID != user.UserID).UserID;
		const target = await this.userService.findOne(targetID, ['blocked']);
		return !!target.blocked.find(usr => usr.UserID == user.UserID)
	}
}
