import { IUser } from './types';
import { Socket } from 'socket.io';

// +---------------------------------------------------------------------+
// |                           GAME INTERFACE                            |
// +---------------------------------------------------------------------+

export enum EGameMod {
  classic,
  ghost,
  trainning,
  rumble
}

export interface ISizeGameElements {
  tableServerSize   : IVector2D; //sert a calculer le coef d'agrandissement ou reduction cote front par rapport a la taille d'affichage
  ballSize          : IVector2D;
  paddleP1Pos       : IVector2D;
  paddleP2Pos       : IVector2D;
  paddleP1Size      : IVector2D;
  paddleP2Size      : IVector2D;
}

export interface IGameSessionInfo {
  game_id           : number;
  gameName          : string;
  player1           : Partial<IUser>;
  player2           : Partial<IUser>;
  launchTime        : Date;
  startInitElement  : ISizeGameElements;
  // spectators: Partial<IUser>[];
}

export enum EKeyEvent {
	arrowUpPressed,
	arrowUpRelease,
	arrowDownPressed,
	arrowDownRelease
}

export interface IPodTable {
  positionBall      : IVector2D;
  sizeBall          : IVector2D;
	positionP1v       : IVector2D;
	positionP2v       : IVector2D;
	maxPosP1          : number;
	maxPosP2          : number;
	sizeP1            : IVector2D;
	sizeP2            : IVector2D;
	tableSize         : IVector2D;
  scoreP1           : number;
  scoreP2           : number;
  trainningHit      : number;
  maxTrainningHit   : number;
  }


//vecteur unitaire pour direction de la balle
export interface IDirectionVec2D {
    dx                 : number;
    dy                 : number;
  }

export interface IVector2D {
	x                 : number;
	y                 : number;
}

export interface IBall {
	pos               : IVector2D;
	size              : number;
	velocity          : number;
	direction         : number;
}

export enum IDirectionMove {
	up,
	down,
}

//mise a jour mouvement paddel transmit par ws
export interface IGamePlayerMove {
	game_id           : number;
	user_id           : number;
	direction         : IDirectionMove;
}

export interface userInfoSocket {
	user              : Partial<IUser>;
	socket            : Socket;
}

export class Stack<T> {
	private elements: T[] = [];

	push(element: T): void {    this.elements.push(element);	}
	pop(): T | undefined {	    return this.elements.pop();	}
	peek(): T | undefined {	    return this.elements[this.elements.length - 1];	}
	isEmpty(): boolean {	      return this.elements.length === 0;}
	size(): number {            return this.elements.length;}
  toArray(): T[] {            return [...this.elements];
  }
}