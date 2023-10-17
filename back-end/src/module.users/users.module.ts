import {forwardRef, Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserEntity} from '../entities/user.entity';
import {UserCredentialEntity} from '../entities/credential.entity';
import {ChannelModule} from "../module.channels/channel.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity, UserCredentialEntity]),
		forwardRef(() => ChannelModule),
	],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {
}
