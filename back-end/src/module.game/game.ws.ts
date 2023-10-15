import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket,
} from '@nestjs/websockets';

import {Server, Socket} from 'socket.io';
import {ServerGame} from 'src/module.game/server/ServerGame';
import {wsGameRoutes} from 'shared/routesApi';
import {userInfoSocket} from 'shared/typesGame';
import {UseGuards} from '@nestjs/common';
import {UserEntity, UserStatus} from '../entities/user.entity';
import {CurrentUser} from '../module.auth/indentify.user';
import {WSAuthGuard, getToken} from "../module.auth/auth.guard";


@WebSocketGateway({
	namespace: '/game',
})

export class WebsocketGatewayGame
	implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private serverGame: ServerGame) {
	}

	@WebSocketServer()  
	public server: Server;

	handleConnection(@ConnectedSocket() client: Socket) {
		console.log('NEW CONNEXION WS CLIENT THEGAME, id = ' + client.id);
		const tokenInfo = getToken(client);

		const type = tokenInfo.type;
		const token = tokenInfo.token;

		// console.log('token game = ' + token)

		client.emit(wsGameRoutes.statusUpdate(), UserStatus.ONLINE);

		this.server.to(client.id).emit('welcome', 'Bienvenue sur TheGame');
		client.emit('welcome', 'Bienvenue sur TheGame');

	}

	@UseGuards(WSAuthGuard)
	handleDisconnect(client: Socket) {
		console.log('CLIENT ' + client.id + ' left');

		this.serverGame.leftConnectionUserMatchmaking(client)
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
		console.log(client.id + '= ' + user.login + 'is connected to serverGame instance');
		//TODO: save user in list user ? useless ? yes i thinks better with sql request for check online user
		client.emit('welcome', 'Bienvenue sur le game server'); //message dacceuil connection websocket
	}

	@SubscribeMessage(wsGameRoutes.addPlayerToMatchmaking())
	@UseGuards(WSAuthGuard)
	addPlayerToMatchmaking(
		@ConnectedSocket() client: Socket,
		@CurrentUser() user: UserEntity
	) {
		// console.log(client.id + ': ' + payload.nickname);
		// console.log('json user: ' + JSON.stringify(payload));

		const player: userInfoSocket = {socket: client, user};
		this.serverGame.addPlayerToMatchmaking(player, this.server);
		client.emit('info', `Matchmaking: attente d\'autres joueurs...`);
	}

	@SubscribeMessage(wsGameRoutes.addPlayerToMatchmakingGhost())
	@UseGuards(WSAuthGuard)
	addPlayerToMatchmakingGhost(
		@ConnectedSocket() client: Socket,
		@CurrentUser() user: UserEntity
	) {
		// console.log(client.id + ': ' + payload.nickname);
		// console.log('json user: ' + JSON.stringify(payload));

		const player: userInfoSocket = {socket: client, user};
		this.serverGame.addPlayerToMatchmakingGhost(player, this.server);
		client.emit('info', `MatchmakingGhost: attente d\'autres joueurs...`);
	}

	@SubscribeMessage(wsGameRoutes.removePlayerToMatchmaking())
	@UseGuards(WSAuthGuard)
	RemoveUserToMatchmaking(
		@ConnectedSocket() client: Socket,
		@CurrentUser() user: UserEntity
	) {
		// console.log(`TRY removePlayerToMatchnaking:  ${payload.nickname}`);
		const player: userInfoSocket = {socket: client, user};
		this.serverGame.removePlayerToMatchmaking(player);
		// client.emit('info', `Matchmaking: attente d\'autres joueurs...`);
	}

	@SubscribeMessage(wsGameRoutes.removePlayerToMatchmakingGhost())
	@UseGuards(WSAuthGuard)
	RemoveUserToMatchmakingGhost(
		@ConnectedSocket() client: Socket,
		@CurrentUser() user: UserEntity
	) {
		// console.log(`TRY removePlayerToMatchnaking:  ${payload.nickname}`);
		const player: userInfoSocket = {socket: client, user};
		this.serverGame.removePlayerToMatchmakingGhost(player);
		// client.emit('info', `Matchmaking: attente d\'autres joueurs...`);
	}


	@SubscribeMessage(wsGameRoutes.createTrainningGame())
	@UseGuards(WSAuthGuard)
	createTrainningGame(
		@ConnectedSocket() client: Socket,
		@CurrentUser() user: UserEntity
	) {
		// console.log(client.id + ': ' + payload.nickname);
		// console.log('json user: ' + JSON.stringify(payload));
		const player: userInfoSocket = {socket: client, user};
		this.serverGame.addPlayerInTrainningSession(player, this.server);
		client.emit('info', `Trainning game loading...`);
	}
}
