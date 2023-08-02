import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
	ChannelCredentialEntity,
	UserCredentialEntity,
} from '../entities/credential.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CredentialService {
	constructor(
		@InjectRepository(UserCredentialEntity)
		private userCredentialRepository: Repository<UserCredentialEntity>,
		@InjectRepository(ChannelCredentialEntity)
		private channelCredentialRepository: Repository<ChannelCredentialEntity>,
	) {}

	async createUser(rawPassword: string) {
		const salt = bcrypt.genSaltSync();
		const hash = await bcrypt.hash(rawPassword, salt);

		return this.userCredentialRepository.create({
			password: hash,
		});
	}

	async compareUser(rawPassword: string, credential: UserCredentialEntity) {
		return bcrypt.compareSync(rawPassword, credential.password);
	}
}
