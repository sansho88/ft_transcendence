import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCredentialEntity } from '../entities/credential.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserCredentialService {
	constructor(
		@InjectRepository(UserCredentialEntity)
		private userCredentialRepository: Repository<UserCredentialEntity>,
	) {}

	async create(rawPassword: string) {
		const salt = bcrypt.genSaltSync();
		const hash = await bcrypt.hash(rawPassword, salt);

		return this.userCredentialRepository.create({
			password: hash,
		});
	}

	async compare(rawPassword: string, credential: UserCredentialEntity) {
		if(!credential)
		 return false;
		return bcrypt.compareSync(rawPassword, credential.password);
	}
}
