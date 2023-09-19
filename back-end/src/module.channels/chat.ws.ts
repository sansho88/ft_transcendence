import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { WSAuthGuard } from '../module.auth/auth.guard';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { CurrentUser } from '../module.auth/indentify.user';
import { ChannelService } from './channel.service';
import { UsersService } from '../module.users/users.service';
import { ChannelCredentialService } from './credential.service';
import { ChannelEntity } from '../entities/channel.entity';
import { UserEntity, UserStatus } from '../entities/user.entity';
import { accessToken } from '../dto/payload';
import * as process from 'process';
import { JwtService } from '@nestjs/jwt';
import {
	CreateChannelDTOPipe,
	JoinChannelDTOPipe,
} from '../dto.pipe/channel.dto';
import {
	ReceivedMessageDTOPipe,
	SendMessageDTOPipe,
} from '../dto.pipe/message.dto';

class SocketUserList {
	userID: number;
	socketID: string;
}

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway
	extends IoAdapter
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;
	private socketUserList: SocketUserList[]; // maybe not needed

	constructor(
		private messageService: MessageService,
		private channelService: ChannelService,
		private usersService: UsersService,
		private channelCredentialService: ChannelCredentialService,
		private jwtService: JwtService,
	) {
		super();
	}

	// Todo: Maybe Give Bearer Token to auth when 1st connection then keep userID and client.ID in a map-like structure
	// Or We could also use a 'Auth' event to identify the user post connection

	async handleConnection(client: Socket) {
		const [type, token] =
			client.handshake.headers.authorization?.split(' ') ?? [];
		if (type !== 'Bearer') return client.disconnect();
		if (!token) return client.disconnect();
		let userID: number;
		try {
			const payloadToken: accessToken = await this.jwtService.verifyAsync(
				token,
				{
					secret: process.env.SECRET_KEY,
				},
			);
			userID = payloadToken.id;
		} catch {
			return client.disconnect();
		}
		const user = await this.usersService.findOneRelation(userID, {
			channelJoined: true,
		});
		if (!user) return client.disconnect();

		if (typeof user.channelJoined === 'undefined') return;
		client.join(
			user.channelJoined.map((chan) => {
				return chan.name;
			}),
		);
		this.usersService.userStatus(userID, UserStatus.ONLINE).then();
		this.socketUserList.push({
			socketID: client.id,
			userID: userID
		});
		console.log(`New connection from User ${userID}`);
	}

	//Todo: leave room + offline
	async handleDisconnect(client: Socket) {
		const [type, token] =
			client.handshake.headers.authorization?.split(' ') ?? [];
		if (type !== 'Bearer') return client.disconnect();
		if (!token) return client.disconnect();
		const payloadToken: accessToken = await this.jwtService.verifyAsync(token, {
			secret: process.env.SECRET_KEY,
		});
		const userID = payloadToken.id;
		this.usersService.userStatus(userID, UserStatus.OFFLINE).then();
		console.log(`DisConnection ${client.id}`);
	}

	@SubscribeMessage('createRoom')
	@UseGuards(WSAuthGuard)
	async handelCreateRoom(
		@MessageBody(new ValidationPipe()) data: CreateChannelDTOPipe,
		@CurrentUser('id') userID: number,
		@ConnectedSocket() client: Socket,
	) {
		const user = await this.usersService.findOne(userID);
		const credential = await this.channelCredentialService.create(
			data.password,
		);
		const chan = await this.channelService.create(
			data.name,
			credential,
			data.privacy,
			user,
		);
		client.join(data.name);
		client.emit(`createRoom`, {
			message: `Channel Created with id ${chan.channelID}`,
		});
	}

	@SubscribeMessage('joinRoom')
	@UseGuards(WSAuthGuard)
	async handelJoinRoom(
		@MessageBody(new ValidationPipe()) data: JoinChannelDTOPipe,
		@CurrentUser('id') userID: number,
		@ConnectedSocket() client: Socket,
	) {
		const chan = await this.channelService.findOne(data.channelID);
		const user = await this.usersService.findOne(userID);
		if (!chan || typeof data.channelID === 'undefined')
			return client.emit('sendMsg', { error: 'There is no such Channel' });
		if (await this.channelService.isUserOnChan(chan, user))
			return client.emit(`joinRoom`, {
				message: `You are already on that channel`,
			});
		if (!(await this.channelService.checkCredential(data)))
			return client.emit(`joinRoom`, {
				message: `You cannot Join that channel`,
			});
		await this.channelService.joinChannel(user, chan);
		client.join(chan.name);
		await this.SendMessage(
			chan,
			0,
			`User ${user.nickname} Joined the channel ${chan.name}`,
		);
		console.log(`JOIN Room ${data.channelID} By ${userID}`);
	}

	@SubscribeMessage('sendMsg')
	@UseGuards(WSAuthGuard)
	async handelMessages(
		@MessageBody(new ValidationPipe()) data: SendMessageDTOPipe,
		@CurrentUser('id') userID: number,
		@ConnectedSocket() client: Socket,
	) {
		const user = await this.usersService.findOne(userID);
		const chan = await this.channelService.findOne(data.channelID);
		if (!chan || typeof data.channelID === 'undefined')
			return client.emit('sendMsg', { error: 'There is no such Channel' });
		if (await this.channelService.userInChannel(user, chan)) {
			await this.messageService.create(user, data.content, chan);
			return await this.SendMessage(chan, user, data.content);
		}
		return client.emit('sendMsg', {
			error: 'You are not part of this channel',
		});
	}

	@SubscribeMessage('debug')
	async handelDebug(client: Socket) {
		return client.emit('This is a debug');
	}

	/**
	 * @param channel
	 * @param user If 0-> Meant to be the system !
	 * @param content
	 */
	async SendMessage(
		channel: ChannelEntity,
		user: UserEntity | number,
		content: string,
	) {
		let userID: number;
		if (typeof user !== 'number') userID = user.UserID;
		else userID = user;
		const msg: ReceivedMessageDTOPipe = {
			authorID: userID,
			channelID: channel.channelID,
			content: content,
		};
		this.server.to(channel.name).emit(`sendMsg`, msg);
		console.log(` Send Message on ${channel.name}, by ${userID}`);
	}
}
