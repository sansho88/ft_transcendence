import { Injectable, Inject } from '@nestjs/common';
import { Matchmaking } from './Matchmaking';
import { GameSession } from './GameSession';
import { WebsocketGatewayGame } from '../websocket/wsGame.gateway';
import { Server, Socket } from 'socket.io';
import { userInfoSocket, Stack, EGameMod } from 'shared/typesGame';
import { v4 as uuidv4 } from "uuid";

// @Injectable()
// export class gameSocketService {
//     constructor(private websocketGatewayGame: WebsocketGatewayGame) {}
// }

@Injectable()
export class ServerGame {
  private matchmaking: Matchmaking = new Matchmaking();
  private gameSession: GameSession[] = [];
  private trainningSession: GameSession[] = []; //pour ne pas les melangers, pas de spectator, donc pas besoin de get cette liste

  constructor(){}
  
  public addPlayerToMatchmaking(player: userInfoSocket, server: Server) {
    if (!player)
        return console.log('addPlayerToMatchmaking: Error player')
    this.matchmaking.addUser(player);
    console.log(`${player.user.login}: add in matchmaking list`);
    if(this.matchmaking.getUsersNumber() >= 2)
    {
      //TODO: push en DB ? ou alors push en db uniquement si game terminé
      this.gameSession.push(this.matchmaking.createGame(server, this.gameSession.length)); //FIXME: recup game_id de la DB
    }
  }

  
  public removePlayerToMatchmaking(player: userInfoSocket) {
    if (!player)
    return console.log('removePlayerToMatchmaking: Error player')
  this.matchmaking.removeUser(player);
  // console.log(`${player.user.login}: remove in matchmaking list`);
}

  public addPlayerInTrainningSession(player: userInfoSocket, server: Server) {
    if (!player)
      return console.log('addPlayerToMatchmaking: Error player');
    this.trainningSession.push(this.createTrainningSessionGame(server, 0, player));
  }

  public getGameSession(game_id: number): GameSession { 
    this.gameSession.forEach((game) => {
      if(game.getGameId() === game_id)
        return game;
    })
    return null;
  }

  //create game instance for solo trainnig game
  private createTrainningSessionGame( server: Server, game_id: number, player: userInfoSocket): GameSession {

      const startDate : Date = new Date();
      const generateSessionName : string = uuidv4();
      console.log(`NEW TRAINNING SESSION: ${generateSessionName} | ${player.user.nickname})`);
      return new GameSession(server, player, player, startDate, game_id, EGameMod.trainning, generateSessionName);
  }


  public getAllGameSession(): GameSession[] { return this.gameSession; }
}