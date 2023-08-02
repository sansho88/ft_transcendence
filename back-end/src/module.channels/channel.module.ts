import { forwardRef, Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from '../entities/channel.entity';
import { ChannelCredentialEntity } from '../entities/credential.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([ChannelEntity, ChannelCredentialEntity]),
		forwardRef(() => UsersModule),
	],
	controllers: [ChannelController],
	providers: [ChannelService],
	exports: [ChannelService],
})
export class UsersModule {}
