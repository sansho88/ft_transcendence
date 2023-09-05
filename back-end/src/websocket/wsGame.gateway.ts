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
	public server: Server;

	handleConnection(@ConnectedSocket() client: Socket) {
		console.log('NEW CONNEXION CLIENT THEGAME, id = ' + client.id);
		this.server.to(client.id).emit('welcome', 'Bienvenue sur TheGame');
	}

	handleDisconnect(client: Socket) {
		// client.disconnect();
		// Code pour gérer les déconnexions client
		console.log('CLIENT ' + client.id + ' left');
	}

  emitToGameRoom(room: string, payload: any) {
    this.server.emit(room, payload)
  }

	@SubscribeMessage(wsGameRoutes.addNewPlayerToServer())
	welcomeToGameServer(client: Socket, payload: Partial<IUser>) {
    if (payload.login)
		  console.log(client.id + '= ' + payload.login + 'is connected to serverGame instance');
    //TODO: save user in list user ? useless ? yes i thinks better with sql request for check online user
		client.emit('welcome', 'Bienvenue sur le game server'); //message dacceuil connection websocket
	}

	@SubscribeMessage(wsGameRoutes.addPlayerToMatchnaking())
	addPlayerToMatchmaking(client: Socket, payload: Partial<IUser>) {
		// console.log(client.id + ': ' + payload.nickname);
		// console.log('json user: ' + JSON.stringify(payload));
    if (!payload.nickname)
      return console.error('ws/welcomeToGameServer: Bad client or user');  
    
    const player: userInfoSocket = {socket: client, user: payload};
    this.serverGame.addPlayerToMatchmaking(player, this.server);
		client.emit('info', `Matchmaking: attente d\'autres joueurs...`);
	}
  
	@SubscribeMessage(wsGameRoutes.removePlayerToMatchnaking())
	RemoveUserToMatchmaking(client: Socket, payload: Partial<IUser>) {
    // console.log(`TRY removePlayerToMatchnaking:  ${payload.nickname}`); 
    if (!payload.nickname)
    return console.error('ws/welcomeToGameServer: Bad client or user');  
  const player: userInfoSocket = {socket: client, user: payload};
  this.serverGame.removePlayerToMatchmaking(player);
  // client.emit('info', `Matchmaking: attente d\'autres joueurs...`);
}


  @SubscribeMessage(wsGameRoutes.createTrainningGame())
  createTrainningGame(client: Socket, payload: Partial<IUser>) {
    // console.log(client.id + ': ' + payload.nickname);
    // console.log('json user: ' + JSON.stringify(payload));
    if (!payload.nickname)
      return console.error('ws: Bad client or user');  
    
    const player: userInfoSocket = {socket: client, user: payload};
    this.serverGame.addPlayerInTrainningSession(player, this.server);
    client.emit('info', `Trainning game loading...`);
  }
}
