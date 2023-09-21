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
import { ParseIntPipe, UseGuards, ValidationPipe} from '@nestjs/common';
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

@WebSocketGateway({ namespace: 'chat' ,cors: true})
export class ChatGateway
	extends IoAdapter
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;
	private socketUserList: SocketUserList[] = [];

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
		if (user == null) return client.disconnect();

		if (typeof user.channelJoined === 'undefined') return;
		client.join(
			user.channelJoined.map((chan) => {
				return chan.name;
			}),
		);
		await this.usersService.userStatus(user , UserStatus.ONLINE);
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
		let payloadToken: accessToken;
		try {
			payloadToken= await this.jwtService.verifyAsync(token, {
				secret: process.env.SECRET_KEY,
			});
		} catch {
			return client.disconnect();
		}
		const user = await this.usersService.findOne(payloadToken.id);
		if (!user) return client.disconnect();
		this.usersService.userStatus(user, UserStatus.OFFLINE).then();
		// const index = this.socketUserList.indexOf()
		// this.socketUserList.slice()
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
		@CurrentUser() user: UserEntity,
		@ConnectedSocket() client: Socket,
	) {
		const chan = await this.channelService.findOne(data.channelID);
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
		console.log(`JOIN Room ${data.channelID} By ${user.UserID}`);
	}

	@SubscribeMessage('sendMsg')
	@UseGuards(WSAuthGuard)
	async handelMessages(
		@MessageBody(new ValidationPipe()) data: SendMessageDTOPipe,
		@CurrentUser() user: UserEntity,
		@ConnectedSocket() client: Socket,
	) {
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

	private async getSocket(userID: number){
		const clientID = this.socketUserList.find(value => userID == value.userID).socketID;
		return this.server.fetchSockets().then(value => {
			return value.find(value1 => value1.id == clientID);
		})
	}


	// // // // // // // // //
	// /	Admin Services	/ //
	// // // // // // // // //


	public async addAdmin(){}
	public async removeAdmin(){}
	public async ban(){}
	public async pardon(){}
	public async kick(){}


	@SubscribeMessage('debug')
	async handelDebug(
		@ConnectedSocket() client: Socket,
		@MessageBody(ParseIntPipe) id: number,
	) {
		console.log(' ==== debug !');
		const target = await this.getSocket(id);
		target.emit('debug', 'AHAHHA CA MARCHE');
	}
}
