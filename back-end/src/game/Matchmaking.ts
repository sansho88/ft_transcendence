import { Injectable, Inject } from '@nestjs/common';
import { WebsocketGatewayGame } from '../websocket/wsGame.gateway';
import { userInfoSocket, Stack } from 'shared/typesGame';
import { GameSession } from './GameSession';


export class Matchmaking {
  private userStack: Stack<userInfoSocket> = new Stack<userInfoSocket>();

  constructor() {}

  public getUsersNumber()               : number  { return this.userStack.size() }
  public addUser(user: userInfoSocket)  : void    { this.userStack.push(user); }

  public createGame(): GameSession {
    if (this.getUsersNumber() >= 2){
      const P1: userInfoSocket = this.userStack.pop();
      const P2: userInfoSocket = this.userStack.pop();
      const startDate : Date = new Date;
      return new GameSession(P1, P2, startDate, 42);
    }
    else
      console.log('Matchmaking: Pas assez de joueurs pour lancer une partie');
  }
}
