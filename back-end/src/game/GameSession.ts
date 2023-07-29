import { userInfoSocket } from 'shared/typesGame';
import { Socket } from 'socket.io';
import { Matchmaking } from './Matchmaking';


import { Injectable, Inject } from '@nestjs/common';
import { WebsocketGatewayGame } from '../websocket/wsGame.gateway';
import { IUser } from 'shared/types';



export class GameSession {
	private game_id: number;
	private gameRoom: string;
	private startDate: Date;

	private player1: userInfoSocket;
	private player2: userInfoSocket;
	private spectator: userInfoSocket[];

  private isGameRunning: boolean = false;


  constructor(P1: userInfoSocket, P2: userInfoSocket, startDate: Date, game_id: number) {
		this.player1 = P1;
		this.player1 = P2;
    this.startDate = startDate;
	}

    public getGameId(): number {
      return this.game_id;
    }

    public getPlayer1(): userInfoSocket { return this.player1; }
    public getPlayer2(): userInfoSocket { return this.player2; }
    public setSocketPlayer1(newSocket: Socket) {this.player1.socket = newSocket} //pour gerer une deco/reconnection ?
    public setSocketPlayer2(newSocket: Socket) {this.player2.socket = newSocket}

    public startGame() {
      this.isGameRunning = true;
  }
  
  // function countPlayer(): number {

  // }
}
