import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {MessageEntity} from '../entities/message.entity';
import {Repository} from 'typeorm';
import {UserEntity} from '../entities/user.entity';
import {ChannelEntity} from '../entities/channel.entity';

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(MessageEntity)
		private messageRepository: Repository<MessageEntity>,
	) {
	}

	async create(user: UserEntity, content: string, chan: ChannelEntity) {
		let sendTime = new Date();
		sendTime.setUTCHours(sendTime.getHours() + 2)
		const msg = await this.messageRepository.create({
			author: user,
			channel: chan,
			content: content,
			sendTime: sendTime,
		});
		await msg.save();
		return msg;
	}

	filterBefore(messages: MessageEntity[], timestamp: Date) {
		// let i = 2;
		// return messages
		// 	.sort((a, b) => b.sendTime.getTime() - a.sendTime.getTime())
		// 	.filter(() => i-- > 0)
	}

	filterAfter(messages: MessageEntity[], maxTime: Date) {
		let i = 10;
		return messages
			.sort((a, b) => a.sendTime.getTime() - b.sendTime.getTime())
			.filter((msg) => {
				if (msg.sendTime.getTime() > maxTime.getTime())
					return i-- > 0;
				else
					return false;
			})
	}

	filterRecent(messages: MessageEntity[]) {
		let i = 30;
		return messages
			.sort((a, b) => b.sendTime.getTime() - a.sendTime.getTime())
			.filter(() => i-- > 0)
	}
}
