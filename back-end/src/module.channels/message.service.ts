import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '../entities/message.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { ChannelEntity } from '../entities/channel.entity';

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(MessageEntity)
		private messageRepository: Repository<MessageEntity>,
	) {}

	async create(user: UserEntity, content: string, chan: ChannelEntity) {
		const msg = await this.messageRepository.create({
			author: user,
			channel: chan,
			content: content,
			sendTime: new Date(),
		});
		await msg.save();
		return msg;
	}
}
