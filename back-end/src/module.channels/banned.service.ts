import {BadRequestException, Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {BannedEntity} from "../entities/banned.entity";
import {UserEntity} from "../entities/user.entity";
import {ChannelEntity} from "../entities/channel.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class BannedService {
	constructor(
		@InjectRepository(BannedEntity)
		private bannedRepository: Repository<BannedEntity>,
	) {
	}

	async create(user: UserEntity, channel: ChannelEntity, duration: number) {
		console.log('create BanEntity');
		let endTime = null;
		if (duration) {
			endTime = new Date();
			endTime.setUTCHours(endTime.getHours() + 2);
			endTime.setSeconds(endTime.getSeconds() + duration);
		}
		const ban = this.bannedRepository.create({
			channel,
			user,
			endTime,
		});
		await ban.save();
		return ban;
	}

	async findAll(channel?: ChannelEntity) {
		let lst = await this.bannedRepository.find();
		if (!channel)
			return lst;
		return lst.filter(ban => ban.channel.channelID == channel.channelID)
	}

	async findOne(banID: any) {
		const ban = await this.bannedRepository.findOneBy({bannedID: banID});
		if (ban == null)
			throw new BadRequestException('This Ban ID is not in use (possibly already unban or not banned yet)');
		return ban;
	}

	async update() {
		const bans = await this.findAll();
		const now = new Date();
		now.setHours(now.getHours() + 2);
		const pardons = bans.filter(ban => ban.endTime < now && ban.endTime != null)
		pardons.map(pardon => {
			pardon.remove();
		})
	}

	pardon(ban: BannedEntity) {
		return ban.remove();
	}
}