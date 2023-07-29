import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket,
} from '@nestjs/websockets';
import { IUser } from 'shared/types';
import { Server, Socket } from 'socket.io';
import { ServerGame } from 'src/game/ServerGame';
import { wsGameRoutes } from 'shared/routesApi';
import { userInfoSocket } from 'shared/typesGame';
import { HttpException, HttpStatus } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@WebSocketGateway({
	transports: ['websocket'],
	cors: true,
	namespace: '/game',
})

export class WebsocketGatewayGame
	implements OnGatewayConnection, OnGatewayDisconnect
{
	constructor(private serverGame: ServerGame) {}

	@WebSocketServer()
	private server: Server;

	handleConnection(@ConnectedSocket() client: Socket) {
		console.log('NEW CONNEXION CLIENT THEGAME, id = ' + client.id);
		this.server.to(client.id).emit('welcome', 'Bienvenue sur TheGame');
	}

	handleDisconnect(client: Socket) {
		// client.disconnect();
		// Code pour gérer les déconnexions client
		console.log('CLIENT ' + client.id + ' left');
	}

	@SubscribeMessage(wsGameRoutes.addNewPlayerToServer())
	welcomeToGameServer(client: Socket, payload: Partial<IUser>) {
    if (payload.login)
		  console.log(client.id + '= ' + payload.login + 'is connected to serverGame instance');
		client.emit('welcome', 'Bienvenue sur le game server');
	}

	@SubscribeMessage(wsGameRoutes.addPlayerToMatchnaking())
	handleGame(client: Socket, payload: Partial<IUser>) {
		console.log(client.id + ': ' + payload.nickname);
    if (!payload.nickname)
      return console.error('ws/welcomeToGameServer: Bad client or user'); 
    const player: userInfoSocket = {socket: client, user: payload};
    this.serverGame.addPlayerToMatchmaking(player);
    console.log('helllo');
		client.emit('info', `Matchmaking: attente d\'autres joueurs...`);
	}

}
