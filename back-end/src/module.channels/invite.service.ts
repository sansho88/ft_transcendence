import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserEntity} from '../entities/user.entity';
import {ChannelEntity} from '../entities/channel.entity';
import {InviteEntity} from "../entities/invite.entity";

@Injectable()
export class InviteService {
	constructor(
		@InjectRepository(InviteEntity)
		private inviteRepository: Repository<InviteEntity>,
	) {
	}

	async create(user: UserEntity, channel: ChannelEntity, sender: UserEntity) {
		const invite = await this.inviteRepository.create({
			user,
			channel,
			sender,
		});
		await invite.save();
		return invite;
	}

	async findAllChannel(channel: ChannelEntity) {
		const lst = await this.findAll();
		return lst.filter(invite =>
			invite.channel.channelID == channel.channelID
		)
	}

	async findAllReceivedUser(user: UserEntity) {
		const lst = await this.findAll();
		return lst.filter(invite =>
			invite.user.UserID == user.UserID
		)
	}

	async findAllSendUser(user: UserEntity) {
		const lst = await this.findAll();
		return lst.filter(invite =>
			invite.sender.UserID == user.UserID
		)
	}

	findAll() {
		return this.inviteRepository.find({relations: ['channel', 'user', 'sender']});
	}

	findOne(inviteID: number) {
		return this.inviteRepository.findOne({
			where: {inviteID},
			relations: ['user', 'channel', 'sender'],
		});
	}

	async remove(invite: InviteEntity) {
		await invite.remove();
	}

	async userIsInvite(channel: ChannelEntity, user: UserEntity) {
		const lst = await this.findAllChannel(channel);
		return (lst.find(invite => invite.user.UserID == user.UserID));
	}
}
