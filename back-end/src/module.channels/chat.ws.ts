import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import {IoAdapter} from '@nestjs/platform-socket.io';
import {Server, Socket} from 'socket.io';
import {MessageService} from './message.service';
import {WSAuthGuard} from '../module.auth/auth.guard';
import {ParseIntPipe, UseGuards, ValidationPipe} from '@nestjs/common';
import {CurrentUser} from '../module.auth/indentify.user';
import {ChannelService} from './channel.service';
import {BannedService} from "./banned.service";
import {UsersService} from '../module.users/users.service';
import {ChannelCredentialService} from './credential.service';
import {UserEntity, UserStatus} from '../entities/user.entity';
import {ChannelEntity} from '../entities/channel.entity';
import {accessToken} from '../dto/payload';
import * as process from 'process';
import {JwtService} from '@nestjs/jwt';
import {
	CreateChannelDTOPipe,
	JoinChannelDTOPipe,
	LeaveChannelDTOPipe,
} from '../dto.pipe/channel.dto';
import {
	JoinEventDTOPipe,
	LeaveEventDTOPipe,
	ReceivedMessageDTOPipe,
	SendMessageDTOPipe,
} from '../dto.pipe/message.dto';

class SocketUserList {
	userID: number;
	socketID: string;
}

@WebSocketGateway({namespace: 'chat', cors: true})
export class ChatGateway
	extends IoAdapter
	implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;
	private socketUserList: SocketUserList[] = [];

	constructor(
		private messageService: MessageService,
		private channelService: ChannelService,
		private usersService: UsersService,
		private bannedService: BannedService,
		private channelCredentialService: ChannelCredentialService,
		private jwtService: JwtService,
	) {
		super();
	}

	// Todo: Maybe Give Bearer Token to auth when 1st connection then keep userID and client.ID in a map-like structure
	// Or We could also use a 'Auth' event to identify the user post connection

	async handleConnection(client: Socket) {
		const [type, token] = client.handshake.headers.authorization?.split(' ') ?? [];
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
		const user = await this.usersService
			.findOne(userID, ['channelJoined'])
			.catch(() => null);
		if (user == null) return client.disconnect();

		if (typeof user.channelJoined === 'undefined') return;
		client.join(
			user.channelJoined.map((chan) => {
				return `${chan.channelID}`;
			}),
		);
		await this.usersService.userStatus(user, UserStatus.ONLINE);
		this.socketUserList.push({
			socketID: client.id,
			userID: userID,
		});
		console.log(`New connection from User ${userID}`);
	}

	//Todo: Remove Socket from SocketList
	async handleDisconnect(client: Socket) {
		const [type, token] = client.handshake.headers.authorization?.split(' ') ?? [];
		if (type !== 'Bearer') return client.disconnect();
		if (!token) return client.disconnect();
		let payloadToken: accessToken;
		try {
			payloadToken = await this.jwtService.verifyAsync(token, {
				secret: process.env.SECRET_KEY,
			});
		} catch {
			return client.disconnect();
		}
		const user = await this.usersService
			.findOne(payloadToken.id)
			.catch(() => null);
		if (!user) return client.disconnect();
		this.usersService.userStatus(user, UserStatus.OFFLINE).then();
		// const index = this.socketUserList.indexOf()
		// this.socketUserList = this.socketUserList.slice()
		console.log(`DisConnection ${client.id}`);
	}

	@SubscribeMessage('createRoom')
	@UseGuards(WSAuthGuard)
	async handelCreateRoom(
		@MessageBody(new ValidationPipe()) data: CreateChannelDTOPipe,
		@CurrentUser() user: UserEntity,
		@ConnectedSocket() client: Socket,
	) {
		const credential = await this.channelCredentialService.create(
			data.password,
		);
		const channel = await this.channelService.create(
			data.name,
			credential,
			data.privacy,
			user,
		);
		client.join(`${channel.channelID}`);
		client.emit(`createRoom`, {
			message: `Channel Created with id ${channel.channelID}`,
		});
	}

	@SubscribeMessage('joinRoom')
	@UseGuards(WSAuthGuard)
	async handelJoinRoom(
		@MessageBody(new ValidationPipe()) data: JoinChannelDTOPipe,
		@CurrentUser() user: UserEntity,
		@ConnectedSocket() client: Socket,
	) { // Todo: Need to check for invite
		await this.bannedService.update();
		const channel = await this.channelService
			.findOne(data.channelID, ['userList'])
			.catch(() => null);
		if (channel == null)
			return client.emit('joinRoom', {error: 'There is no such Channel'});
		if (await this.channelService.isUserOnChan(channel, user))
			return client.emit(`joinRoom`, {
				message: `You are already on that channel`,
			});
		if (!(await this.channelService.checkCredential(data)) || await this.channelService.userIsBan(channel, user))
			return client.emit(`joinRoom`, {
				message: `You cannot Join that channel`,
			});
		await this.channelService.joinChannel(user, channel);
		client.join(`${channel.channelID}`);
		const content: JoinEventDTOPipe = {user: user, channelID: channel.channelID}
		this.server.to(`${channel.channelID}`).emit(`joinRoom`, content);
		console.log(`JOIN Room ${data.channelID} By ${user.UserID}`);
	}

	@SubscribeMessage('leaveRoom')
	@UseGuards(WSAuthGuard)
	async handelLeaveRoom(  // Todo : Need To check if Owner leave The channel
		@MessageBody(new ValidationPipe()) data: LeaveChannelDTOPipe,
		@CurrentUser() user: UserEntity,
		@ConnectedSocket() client: Socket,) {
		const channel = await this.channelService
			.findOne(data.channelID, ['adminList', 'userList'])
			.catch(() => null);
		if (channel == null)
			return client.emit('leaveRoom', {error: 'There is no such Channel'});
		if (!await this.channelService.isUserOnChan(channel, user))
			return client.emit('leaveRoom', {error: 'You are not part of this channel'});
		return this.leaveChat(channel, user);
	}

	@SubscribeMessage('sendMsg')
	@UseGuards(WSAuthGuard)
	async handelMessages(
		@MessageBody(new ValidationPipe()) data: SendMessageDTOPipe,
		@CurrentUser() user: UserEntity,
		@ConnectedSocket() client: Socket,
	) {
		const channel = await this.channelService
			.findOne(data.channelID)
			.catch(() => null);
		if (channel == null)
			return client.emit('sendMsg', {error: 'There is no such Channel'});
		if (await this.channelService.userIsMute(channel, user))
			return client.emit('sendMsg', {error: 'You are muted on that channel'});
		if (await this.channelService.userInChannel(user, channel)) {
			await this.messageService.create(user, data.content, channel);
			return await this.SendMessage(channel, user, data.content);
		}
		return client.emit('sendMsg', {
			error: 'You are not part of this channel',
		});
	}

	/**
	 * @param channel
	 * @param user If 0-> Meant to be the system !
	 * @param content
	 */
	async SendMessage(
		channel: ChannelEntity,
		user: UserEntity,
		content: string,
	) {
		const msg: ReceivedMessageDTOPipe = {
			author: user,
			channelID: channel.channelID,
			content: content,
		};
		this.server.to(`${channel.channelID}`).emit(`sendMsg`, msg);
		console.log(` Send Message on ${channel.name}, by ${user.UserID}`);
	}

	private async getSocket(userID: number) {
		const index = this.socketUserList.findIndex(
			(value) => userID == value.userID,
		);
		if (index == -1)
			return undefined;
		return this.server.fetchSockets().then((value) => {
			return value.find(socket =>
				socket.id == this.socketUserList[index].socketID)
		});
	}

	@SubscribeMessage('debug')
	@UseGuards(WSAuthGuard)
	async handelDebug(
		@ConnectedSocket() client: Socket,
		@MessageBody(ParseIntPipe) id: number,
		@CurrentUser() user: UserEntity,
	) {
		console.log(' ==== debug !');
		console.log(user);
		await this.ban(await this.channelService.findOne(id), await this.usersService.findOne(id));
	}

	async leaveChat(channel: ChannelEntity, user: UserEntity) {
		if (this.channelService.userIsAdmin(user, channel))
			channel = await this.channelService.removeAdmin(user, channel);
		channel = await this.channelService.leaveChannel(channel, user);
		const socketTarget = await this.getSocket(user.UserID);
		const content: LeaveEventDTOPipe = {user: user, channelID: channel.channelID};
		this.server.to(`${channel.channelID}`).emit(`leaveRoom`, content);
		if (typeof socketTarget !== 'undefined')
			socketTarget.leave(`${channel.channelID}`)
		return channel;
	}

	async ban(channel: ChannelEntity, user: UserEntity) {
		console.log(user);
		const socket = await this.getSocket(user.UserID);
		if (!socket)
			return;
		return await this.leaveChat(channel, user);
	}
}
