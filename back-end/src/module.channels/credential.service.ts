import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelCredentialEntity } from '../entities/credential.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelCredentialService {
	constructor(
		@InjectRepository(ChannelCredentialEntity)
		private channelCredentialRepository: Repository<ChannelCredentialEntity>,
	) {}

	async create(rawPassword: string) {
		if (!rawPassword)
			return this.channelCredentialRepository.create({
				password: null,
			});
		const salt = bcrypt.genSaltSync();
		const hash = await bcrypt.hash(rawPassword, salt);

		return this.channelCredentialRepository.create({
			password: hash,
		});
	}

	async compare(
		rawPassword: string | undefined,
		credential: ChannelCredentialEntity,
	) {
		if (typeof rawPassword === 'undefined') return false;
		return bcrypt.compareSync(rawPassword, credential.password);
	}
}
