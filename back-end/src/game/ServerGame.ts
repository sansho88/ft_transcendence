import { Injectable, Inject } from '@nestjs/common';
import { Matchmaking } from './Matchmaking';
import { GameSession } from './GameSession';
import { WebsocketGatewayGame } from '../websocket/wsGame.gateway';
import { Server, Socket } from 'socket.io';
import { userInfoSocket, Stack } from 'shared/typesGame';

// @Injectable()
// export class gameSocketService {
//     constructor(private websocketGatewayGame: WebsocketGatewayGame) {}
// }

@Injectable()
export class ServerGame {
  private matchmaking: Matchmaking = new Matchmaking();
  private gameSession: GameSession[] = [];

  constructor(){}
  
  public addPlayerToMatchmaking(player: userInfoSocket, server: Server) {
    if (!player)
        return console.log('addPlayerToMatchmaking: Error player')
    this.matchmaking.addUser(player);
    console.log(`${player.user.login}: add in matchmaking list`);
    if(this.matchmaking.getUsersNumber() >= 2)
    {
      this.gameSession.push(this.matchmaking.createGame(server));
      console.log(`GameSession created`);
    }
  }

  public getGameSession(game_id: number): GameSession {
    this.gameSession.forEach((game) => {
      if(game.getGameId() === game_id)
        return game;
    })
    return null;
  }

}