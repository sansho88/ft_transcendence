import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse
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
	ChangeChannelDTOPipe,
	CreateChannelDTOPipe, CreateMpDTOPPipe,
	JoinChannelDTOPipe,
	LeaveChannelDTOPipe,
} from '../dto.pipe/channel.dto';
import {
	SendMessageDTOPipe,
} from '../dto.pipe/message.dto';
import {getToken} from '../module.auth/auth.guard';
import {
	JoinEventDTO,
	LeaveEventDTO,
	ReceivedMessageEventDTO,
} from '../dto/event.dto'
import {InviteService} from "./invite.service";
import {InviteEntity} from "../entities/invite.entity";
import { wsChatRoutesBack, wsChatRoutesClient } from 'shared/routesApi';
import { channelsDTO } from 'shared/DTO/InterfaceDTO';

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
			.findOne(userID, ['channelJoined', 'subscribed'])
			.catch(() => null);
		if (user == null) return client.disconnect();

		if (typeof user.channelJoined === 'undefined') return;
		client.join(
			user.channelJoined.map((chan) => {
				return `${chan.channelID}`;
			}),
		);
		client.join(
			user.subscribed.map(follow => `user.${follow.UserID}`)
		)
		this.server.to(`user.${user.UserID}`).emit('notifyEvent', `User ${user.login} is online`)
		await this.usersService.userStatus(user, UserStatus.ONLINE);
		this.socketUserList.push({
			socketID: client.id,
			userID: userID,
		});
		console.log('NEW CONNEXION WS CLIENT CHAT v2, id = ' + client.id + ` | userID: ${userID}`);
	}

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
		const index = this.socketUserList
			.findIndex(socket => socket.socketID == socket.socketID)
		this.socketUserList.splice(index, 1);
		if (this.socketUserList.findIndex(socket => socket.socketID == client.id) == -1) {
			this.server.to(`user.${user.UserID}`).emit('notifyEvent', `User ${user.login} is offline`)
			await this.usersService.userStatus(user, UserStatus.OFFLINE);
		}
		console.log(`CLIENT ${client.id} left CHAT WS`);
		return client.disconnect();
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
		const channel: ChannelEntity = await this.channelService.create(
			data.name,
			credential,
			data.privacy,
			user,
		);
		client.join(`${channel.channelID}`);
		client.emit(`infoRoom`, {	message: `Channel Created with id ${channel.channelID}`});
		client.emit(`createRoom`, {channel: channel	}); //FIXME: garder cette ligne , delete celle dessous
		// this.server.emit(`createRoom`, {channel: channel	}) //just pour DBG tous les clients recoivent le channel dans leur liste
	}

	@SubscribeMessage('joinRoom')
	@UseGuards(WSAuthGuard)
	async handelJoinRoom(
		@MessageBody(new ValidationPipe()) data: JoinChannelDTOPipe,
		@CurrentUser() user: UserEntity,
		@ConnectedSocket() client: Socket,
	) {
		await this.bannedService.update();
		let channel = await this.channelService
			.findOne(data.channelID, ['userList'], false)
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
		client.emit(`createRoom`, {channel: channel	})
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

	/**
	 * Ping cette route ws update la liste des channels JOIN de ce meme client
	 * @param user 
	 * @param client 
	 * @returns 
	 */
	@SubscribeMessage(wsChatRoutesClient.updateChannelsJoined())
	@UseGuards(WSAuthGuard)
	async updateClientChannelsJoined( 
		@CurrentUser() user: UserEntity,
		@ConnectedSocket() client: Socket,) {
		return client.emit(wsChatRoutesClient.updateChannelsJoined(), await this.channelService.getJoinedChannelList(user));
	}


	@SubscribeMessage('sendMsg')
	@UseGuards(WSAuthGuard)
	async handelMessages(
		@MessageBody(new ValidationPipe()) data: SendMessageDTOPipe,
		@CurrentUser() user: UserEntity,
		@ConnectedSocket() client: Socket,
	) {
		const channel = await this.channelService
			.findOne(data.channelID, [], true)
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
			error: 'You are not part of this channel', //TODO: il faudra changer pour emit sur invent Info notif, (a definir)
		});

	}


	/********************************/
	/*********       MP       *******/
	/********************************/

	//  todo: Cannot create mp with Blocked User
	//	todo: Cannot send messages if User get block

	@SubscribeMessage('createMP')
	@UseGuards(WSAuthGuard)
	async handelCreateMP(
		@MessageBody(new ValidationPipe()) data: CreateMpDTOPPipe,
		@CurrentUser() user: UserEntity,
		@ConnectedSocket() client: Socket,
	) {
		const user2: UserEntity = await this.usersService.findOne(data.targetID);
		if (!user2) return client.emit('createMP', {messages: 'This user doesn\'t exist'});
		if (user2.UserID == user.UserID) return client.emit('createMP', {messages: 'You cannot create a mp with yourself, Find a friend :D'});
		const channel = await this.channelService.getmp(user, user2).catch(() => null);
		if (channel)
			return client.emit('createMP', {messages: 'You already have a direct channel with this user'});
		// if (user blocked)
		// 	throw new BadRequestException('You cannot create a direct channel with them');
		const mp = await this.channelService.createMP(user, user2);
		client.join(`${mp.channelID}`);
		const client2 = await this.getSocket(user2.UserID);
		if (client2)
			client2.join(`${mp.channelID}`);
		console.log(mp);
	}

	// @SubscribeMessage('getMP')
	// @UseGuards(WSAuthGuard)
	// async handelGetMP(
	// 	@MessageBody(new ValidationPipe()) data: CreateMpDTOPPipe,
	// 	@CurrentUser() user: UserEntity,
	// 	@ConnectedSocket() client: Socket,
	// ) {
	// 	const user2 = await this.usersService.findOne(data.targetID);
	// 	const channel = await this.channelService.getmp(user, user2);
	// 	console.log('return getmp ', channel);
	// }

	/**
	 * @param channel
	 * @param user
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

	async ban(channel: ChannelEntity, target: UserEntity) {
		await this.sendEvent(target, `You got banned for the channel ${channel.name} by a moderator`);
		if (await this.channelService.userInChannel(target, channel))
			await this.leaveChat(channel, target);
	}

	async mute(channel: ChannelEntity, target: UserEntity, duration: number) {
		await this.sendEvent(target, `You got muted by for the channel ${channel.name} by a moderator for ${duration}`);
		return;
	}

	async kick(channel: ChannelEntity, user: UserEntity) {
		await this.sendEvent(user, `You got kicked for the channel ${channel.name} by a moderator`);
		return await this.leaveChat(channel, user);
	}
	
	@SubscribeMessage('NicknameUsed')
	@UseGuards(WSAuthGuard)
	async handleUpdateNickname(
		@ConnectedSocket() client: Socket,
		@MessageBody(new ValidationPipe()) data: {nickname: string})
		{ 
			const res = await this.usersService.nicknameUsed(data.nickname);
		client.emit('NicknameUsed', res);
	}

	async receivedInvite(invite: InviteEntity) {
		await this.sendEvent(invite.user, `You received an Invite for a channel`);
	}

	async sendEvent(
		user: UserEntity,
		messages: string
	) {
		const socketTarget = await this.getSocket(user.UserID);
		if (!socketTarget) return;
		socketTarget.emit('notifyEvent', {messages});
	}

	
	@SubscribeMessage(wsChatRoutesBack.updateRoom())
	@UseGuards(WSAuthGuard)
	async handleUpdateRoom(
		@CurrentUser() user: UserEntity,
		@MessageBody(new ValidationPipe()) data: channelsDTO.IChangeChannelDTOPipe){
		
			const channel = await this.channelService.findOne(data.channelID);
		console.log(channel);
		if (channel.owner.UserID !== user.UserID)
			return;
		const credential = await this.channelCredentialService.create(data.password);
		this.channelService.modifyChannel(channel, credential, data);
		this.server.to(data.channelID.toString()).emit(wsChatRoutesClient.nameChannelsHasChanged(), channel)
	}
}
