import {BadRequestException, Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {UserEntity} from "../entities/user.entity";
import {ChannelEntity} from "../entities/channel.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {MuteEntity} from "../entities/mute.entity";

@Injectable()
export class MutedService {
	constructor(
		@InjectRepository(MuteEntity)
		private mutedRepository: Repository<MuteEntity>,
	) {
	}

	async create(user: UserEntity, channel: ChannelEntity, duration: number) {
		let endTime = null;
		if (duration) {
			endTime = new Date();
			endTime.setUTCHours(endTime.getHours() + 2);
			endTime.setSeconds(endTime.getSeconds() + duration);
		}
		const ban = this.mutedRepository.create({
			channel,
			user,
			endTime,
		});
		await ban.save();
		return ban;
	}

	async findAll(channel?: ChannelEntity) {
		let lst = await this.mutedRepository.find();
		if (typeof channel === 'undefined')
			return lst;
		return lst.filter(ban => ban.channel.channelID == channel.channelID)
	}

	async findOne(muteID: number) {
		const ban = await this.mutedRepository.findOneBy({muteID: muteID});
		if (ban == null)
			throw new BadRequestException('This Mute ID is not in use (possibly already unmute or not muted yet)');
		return ban;
	}

	async update() {
		const mute = await this.findAll();
		const now = new Date();
		now.setHours(now.getHours() + 2);
		const unmute = mute.filter(mute => mute.endTime < now && mute.endTime != null)
		unmute.map(mute => {
			mute.remove();
		})
	}

	unmute(mute: MuteEntity) {
		return mute.remove();
	}
}