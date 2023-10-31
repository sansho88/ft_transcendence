import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket,
	MessageBody,
} from '@nestjs/websockets';

import {RemoteSocket, Server, Socket} from 'socket.io';
import {ServerGame} from 'src/module.game/server/ServerGame';
import {wsChatRoutesBack, wsGameRoutes} from '../shared/routesApi';
import {userInfoSocket} from '../shared/typesGame';
import {UseGuards, ValidationPipe} from '@nestjs/common';
import {UserEntity, UserStatus} from '../entities/user.entity';
import {CurrentUser} from '../module.auth/indentify.user';
import {WSAuthGuard, getToken} from "../module.auth/auth.guard";
import {accessToken} from '../dto/payload';
import {JwtService} from '@nestjs/jwt';
import {UsersService} from 'src/module.users/users.service';
import {DefaultEventsMap} from 'socket.io/dist/typed-events';
import {WsParsePipe} from "../module.channels/chat.ws";
import {ChallengeAcceptedDTO, CreateChallengeDTOPPipe} from "../dto.pipe/game.dto";


export interface SocketUserList {
	userID: number;
	socketID: string;
}

@WebSocketGateway({
	namespace: '/game',
})
export class WebsocketGatewayGame
	implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private serverGame: ServerGame,
		private jwtService: JwtService,
		private usersService: UsersService,
	) {
	}

	@WebSocketServer()
	public server: Server;
	private socketUserList: SocketUserList[] = [];

	async handleConnection(@ConnectedSocket() client: Socket) {
		const tokenInfo = getToken(client);

		const type = tokenInfo.type;
		const token = tokenInfo.token;
		if (type !== 'Bearer')
			return client.disconnect();
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


		const user = await this.usersService.findOne(userID, ['channelJoined', 'subscribed'])
			.catch(() => null);

		if (user == null)
			return client.disconnect();
		this.server.to(client.id).emit('welcome', 'Bienvenue sur TheGame');
		this.socketUserList.push({
			socketID: client.id,
			userID: userID
		});
	}

	async handleDisconnect(client: Socket) {
		this.serverGame.leftConnectionUserMatchmaking(client)

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
		if (!user)
			return client.disconnect();
		this.socketUserList = this.socketUserList.filter(value => value.socketID != client.id);
		return client.disconnect();
	}

	emitToGameRoom(room: string, payload: any) {
		this.server.emit(room, payload)
	}

	@SubscribeMessage(wsGameRoutes.addNewPlayerToServer())
	@UseGuards(WSAuthGuard)
	welcomeToGameServer(
		@ConnectedSocket() client: Socket,
		@CurrentUser() user: UserEntity
	) {
		client.emit('welcome', 'Bienvenue sur le game server');
	}

	@SubscribeMessage(wsGameRoutes.addPlayerToMatchmaking())
	@UseGuards(WSAuthGuard)
	addPlayerToMatchmaking(
		@ConnectedSocket() client: Socket,
		@CurrentUser() user: UserEntity
	) {
		const player: userInfoSocket = {socket: client, user};
		this.serverGame.addPlayerToMatchmaking(player, this.server);
		client.emit('info', `Matchmaking: attente d\'autres joueurs...`);
	}

	@SubscribeMessage(wsGameRoutes.addPlayerToMatchmakingGhost())
	@UseGuards(WSAuthGuard)
	async addPlayerToMatchmakingGhost(
		@ConnectedSocket() client: Socket,
		@CurrentUser() user: UserEntity
	) {
		const player: userInfoSocket = {socket: client, user};
		await this.serverGame.addPlayerToMatchmakingGhost(player, this.server);
		client.emit('info', `MatchmakingGhost: attente d\'autres joueurs...`);
	}

	@SubscribeMessage(wsGameRoutes.removePlayerToMatchmaking())
	@UseGuards(WSAuthGuard)
	RemoveUserToMatchmaking(
		@ConnectedSocket() client: Socket,
		@CurrentUser() user: UserEntity
	) {
		const player: userInfoSocket = {socket: client, user};
		this.serverGame.removePlayerToMatchmaking(player);
	}

	@SubscribeMessage(wsGameRoutes.removePlayerToMatchmakingGhost())
	@UseGuards(WSAuthGuard)
	RemoveUserToMatchmakingGhost(
		@ConnectedSocket() client: Socket,
		@CurrentUser() user: UserEntity
	) {
		const player: userInfoSocket = {socket: client, user};
		this.serverGame.removePlayerToMatchmakingGhost(player);
	}


	@SubscribeMessage(wsGameRoutes.createTrainningGame())
	@UseGuards(WSAuthGuard)
	async createTrainningGame(
		@ConnectedSocket() client: Socket,
		@CurrentUser() user: UserEntity
	) {
		const player: userInfoSocket = {socket: client, user};
		await this.serverGame.addPlayerInTrainningSession(player, this.server);
		client.emit('info', `Trainning game loading...`);
	}


	@SubscribeMessage(wsChatRoutesBack.createChallenge())
	@UseGuards(WSAuthGuard)
	async createChallengeGame(
		@MessageBody(new ValidationPipe(WsParsePipe)) data: CreateChallengeDTOPPipe,
		@ConnectedSocket() client: Socket,
		@CurrentUser() user: UserEntity,
	) {
		if (this.isInGame(user))
			return client.emit('info', 'You are already in game');
		const P1: userInfoSocket = {socket: client, user: user};
		if (this.serverGame.userInMatchmakingGhost(P1))
			this.serverGame.removePlayerToMatchmakingGhost(P1);
		if (this.serverGame.userInMatchmaking(P1))
			this.serverGame.removePlayerToMatchmaking(P1);
		const sockersChallenged: RemoteSocket<DefaultEventsMap, any>[] = await this.getSocket(data.targetID);
		const P2: UserEntity = await this.usersService.findOne(data.targetID)
		sockersChallenged.forEach((socketLst) => {
			socketLst.emit('info', 'hello Challenged')
		})
		this.serverGame.createChallenge(this.server, P1, P2, data.gameMod, sockersChallenged);
	}

	@SubscribeMessage(wsChatRoutesBack.responseChallenge())
	@UseGuards(WSAuthGuard)
	async acceptChallengeGame(
		@MessageBody(new ValidationPipe(WsParsePipe)) data: ChallengeAcceptedDTO,
		@ConnectedSocket() client: Socket,
		@CurrentUser() user: UserEntity,
	) {
		if (this.isInGame(user))
			return client.emit('info', 'You are already in game');
		if (data.response) {
			this.serverGame.acceptChallenge(this.server, user, client, data.event);
		} else {
			this.serverGame.declineChallenge(user, data.event);
		}
	}

	private isInGame(user: UserEntity): boolean {
		return user.status === UserStatus.INGAME;
	}

	private async getSocket(userID: number) {
		const socketIDLst = this.socketUserList.filter(value => value.userID === userID);
		const socketLst = await this.server.fetchSockets();

		return socketLst.filter(socket => {
			return socketIDLst.some(Id => Id.socketID === socket.id);
		});
	}

}
