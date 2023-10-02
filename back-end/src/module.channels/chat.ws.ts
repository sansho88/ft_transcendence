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
import {UseGuards, ValidationPipe} from '@nestjs/common';
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
	SendMessageDTOPipe,
} from '../dto.pipe/message.dto';
import { getToken } from '../module.auth/auth.guard';
import {
	BannedEventDTO,
	JoinEventDTO,
	KickedEventDTO,
	LeaveEventDTO,
	MutedEventDTO,
	ReceivedInviteEventDTO,
	ReceivedMessageEventDTO,
} from '../dto/event.dto'
import {InviteService} from "./invite.service";
import {InviteEntity} from "../entities/invite.entity";

class SocketUserList {
	userID: number;
	socketID: string;
}

@WebSocketGateway({namespace: 'chat', cors: true})
export class ChatGateway
	extends IoAdapter
	implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	private server: Server;
	private socketUserList: SocketUserList[] = [];


	constructor(
		private messageService: MessageService, 
		private channelService: ChannelService,
		private usersService: UsersService,
		private bannedService: BannedService,
		private channelCredentialService: ChannelCredentialService,
		private jwtService: JwtService,
		private inviteService: InviteService,
	) {
		super();
	}

	// Todo: Maybe Give Bearer Token to auth when 1st connection then keep userID and client.ID in a map-like structure
	// Or We could also use a 'Auth' event to identify the user post connection

		async handleConnection(client: Socket) {
			
			const tokenInfo = getToken(client);
			
			const type = tokenInfo.type;
			const token = tokenInfo.token;

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
		console.log('NEW CONNEXION WS CLIENT CHAT v2, id = ' + client.id + ` | userID: ${userID}`);
	}

	//Todo: leave room + offline
	async handleDisconnect(client: Socket) { 
		const tokenInfo = getToken(client);

		const type = tokenInfo.type;
		const token = tokenInfo.token;
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
		await this.usersService.userStatus(user, UserStatus.OFFLINE);
		// const index = this.socketUserList.indexOf()
		// this.socketUserList = this.socketUserList.slice()
		console.log(`CLIENT ${client.id} left CHAT WS`);
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
	) {
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
		if (await this.channelService.userIsBan(channel, user))
			return client.emit(`joinRoom`, {
				message: `You cannot Join that channel`,
			});
		const invite = await this.inviteService.userIsInvite(channel, user);
		if (!(await this.channelService.checkCredential(data)) && !invite)
			return client.emit(`joinRoom`, {
				message: `You cannot Join that channel`,
			});
		if (invite)
			await this.inviteService.remove(invite);
		await this.channelService.joinChannel(user, channel);
		client.join(`${channel.channelID}`);
		const content: JoinEventDTO = {user: user, channelID: channel.channelID}
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
		const msg: ReceivedMessageEventDTO = {
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
		@CurrentUser() user: UserEntity,
	) {
	}

	async leaveChat(channel: ChannelEntity, user: UserEntity) {
		if (this.channelService.userIsAdmin(user, channel))
			channel = await this.channelService.removeAdmin(user, channel);
		channel = await this.channelService.leaveChannel(channel, user);
		const socketTarget = await this.getSocket(user.UserID);
		if (typeof socketTarget !== 'undefined')
			socketTarget.leave(`${channel.channelID}`)
		const content: LeaveEventDTO = {user: user, channelID: channel.channelID};
		this.server.to(`${channel.channelID}`).emit(`leaveRoom`, content);
		return channel;
	}

	async ban(channel: ChannelEntity, target: UserEntity, duration: number, user: UserEntity) {
		const event: BannedEventDTO = {
			channel,
			user,
			type: BannedEventDTO.name,
			duration,
		}
		await this.sendEvent(target, event);
		if (await this.channelService.userInChannel(target, channel))
			await this.leaveChat(channel, target);
	}

	async mute(channel: ChannelEntity, target: UserEntity, duration: number, user: UserEntity) {
		const event: MutedEventDTO = {
			channel,
			user,
			type: BannedEventDTO.name,
			duration,
		}
		await this.sendEvent(target, event);
		return;
	}

	async kick(channel: ChannelEntity, user: UserEntity) {
		const event: KickedEventDTO = {
			channel,
			user,
			type: KickedEventDTO.name,
		}
		await this.sendEvent(user, event);
		return await this.leaveChat(channel, user);
	}

	async receivedInvite(invite: InviteEntity) {
		const event: ReceivedInviteEventDTO = {
			invite,
			type: ReceivedInviteEventDTO.name,
		}
		await this.sendEvent(invite.user, event);
	}

	async sendEvent(
		user: UserEntity,
		event:
			ReceivedInviteEventDTO |
			BannedEventDTO |
			KickedEventDTO |
			MutedEventDTO,
	) {
		const socketTarget = await this.getSocket(user.UserID);
		if (!socketTarget) return;
		socketTarget.emit('notifyEvent', event);
	}
}
