import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CredentialEntity } from '../entities/credential.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CredentialService {
	constructor(
		@InjectRepository(CredentialEntity)
		private credentialRepository: Repository<CredentialEntity>,
	) {}

	async create(rawPassword: string) {
		const salt = bcrypt.genSaltSync();
		const hash = await bcrypt.hash(rawPassword, salt);

		return this.credentialRepository.create({
			password: hash,
		});
	}

	async compare(rawPassword: string, credential: CredentialEntity) {
		return bcrypt.compareSync(rawPassword, credential.password);
	}
}
