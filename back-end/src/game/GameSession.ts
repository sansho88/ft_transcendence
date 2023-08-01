import * as PODGAME from 'shared/typesGame';
import { Socket } from 'socket.io';
import { Matchmaking } from './Matchmaking';
import { v4 as uuidv4 } from "uuid";
import { Server } from 'socket.io'
import { Injectable, Inject } from '@nestjs/common';
import { WebsocketGatewayGame } from '../websocket/wsGame.gateway';
import { IUser } from 'shared/types';


export interface PodTable {
  positionP1: number;
  positionP2: number;
  maxPosP1  : number;
  maxPosP2  : number;
  sizeP1    : PODGAME.IVector2D;
  sizeP2    : PODGAME.IVector2D;
  size      : PODGAME.IVector2D;
}

export class GameSession {
	private game_id:      number;
	private gameRoom:     string;
	private startDate:    Date;
  private speedPaddle:  number = 30;

	private table: PodTable = {
		positionP1    :0,
		positionP2    :0,
    maxPosP1      :(600 - 60),
    maxPosP2      :(600 - 60),
    sizeP1        :{y: 60, x: 10},
    sizeP2        :{y: 60, x: 10},
		size          :{ x: 800, y: 600 },
	};
	private player1: PODGAME.userInfoSocket;
	private player2: PODGAME.userInfoSocket;
	private spectator: PODGAME.userInfoSocket[];

	private scoreP1: number = 0;
	private scoreP2: number = 0;

	private isGameRunning: boolean = false;

	constructor(
		server: Server,
		P1: PODGAME.userInfoSocket,
		P2: PODGAME.userInfoSocket,
		startDate: Date,
		game_id: number,
	) {
		this.player1 = P1;
		this.player1 = P2;
		this.startDate = startDate;
		this.gameRoom = uuidv4();
		//////////SETUP DE LA TABLE //////////////

		//////////SETUP DES PLAYERS //////////////
		//j'inscrit les player a l'event de cette session
		P1.socket.join(this.gameRoom);
		P2.socket.join(this.gameRoom);

		//j'envoi un nom d'event custom a chaque player sur lequel il vont emettre pour informer qu'il bouge
		P1.socket.emit('play', { remoteEvent: `${this.gameRoom}P1remote` });
		P2.socket.emit('play', { remoteEvent: `${this.gameRoom}P2remote` });

		//j'ecoute leut propre event pour faire bouger leur paddle respectif
		P1.socket.on(`${this.gameRoom}P1remote`, (data) => {
			// console.log(`mooove P1! ${JSON.stringify(data)}`);
      if (data.direction === 'down')
      {
        if (this.table.positionP1 + this.speedPaddle <= this.table.maxPosP1)
          this.table.positionP1 += this.speedPaddle;
      }
      else if (data.direction === 'up')
      {
        if (this.table.positionP1 - this.speedPaddle >= 0)
          this.table.positionP1 -= this.speedPaddle;
      }
      P1.socket.emit('moveP1', this.table.positionP1);
      P2.socket.emit('moveP1', this.table.positionP1);
			console.log(`P1pos = ${this.table.positionP1}`);
		});
		P2.socket.on(`${this.gameRoom}P2remote`, (data) => {
      // console.log(`mooove P2! ${JSON.stringify(data)}`);
      if (data.direction === 'down')
      {
        if (this.table.positionP2 + this.speedPaddle <= this.table.maxPosP2) 
        this.table.positionP2 += this.speedPaddle;
      }
      else if (data.direction === 'up')
      {
        if (this.table.positionP2 - this.speedPaddle >= 0)
        this.table.positionP2 -= this.speedPaddle;
      }
      P1.socket.emit('moveP2', this.table.positionP2);
      P2.socket.emit('moveP2', this.table.positionP2);
      console.log(`P2pos = ${this.table.positionP1}`);
		});

		//petit message d'acceuil pour le debug et avertir que le game va commencer
		P1.socket.emit(
			'info',
			`GameSession: ${this.gameRoom}\nVous jouer face a ${P2.user.login}`,
		);
		P2.socket.emit(
			'info',
			`GameSession: ${this.gameRoom}\nVous jouer face a ${P1.user.login}`,
		);
		server
			.to(this.gameRoom)
			.emit(
				'info',
				`HELLOOOOO GAME SESSIOOOOON, match qui commence : ${P1.user.login} vs ${P2.user.login}`,
			);
	}

	public getGameId(): number {
		return this.game_id;
	}

	public getPlayer1(): PODGAME.userInfoSocket {
		return this.player1;
	}
	public getPlayer2(): PODGAME.userInfoSocket {
		return this.player2;
	}
	public setSocketPlayer1(newSocket: Socket) {
		this.player1.socket = newSocket;
	} //pour gerer une deco/reconnection ?
	public setSocketPlayer2(newSocket: Socket) {
		this.player2.socket = newSocket;
	}

	public startGame() {
		this.isGameRunning = true;
	}
}
