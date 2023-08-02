import { IUser } from './types';
import { Socket } from 'socket.io';

// +---------------------------------------------------------------------+
// |                           GAME INTERFACE                            |
// +---------------------------------------------------------------------+

export interface PodTable {
	positionP1: number;
	positionP2: number;
	maxPosP1  : number;
	maxPosP2  : number;
	sizeP1    : IVector2D;
	sizeP2    : IVector2D;
	size      : IVector2D;
  }

export interface IVector2D {
	x: number;
	y: number;
}

export interface IBall {
	pos: IVector2D;
	size: number;
	velocity: number;
	direction: number;
}

export interface IPosPaddle {
	y: number;
}

export interface ITable {
	posPaddleP1: IPosPaddle;
	posPaddleP2: IPosPaddle;
	ball: IBall;
}

export enum IDirectionMove {
	up,
	down,
}

//mise a jour mouvement paddel transmit par ws
export interface IGamePlayerMove {
	game_id: number;
	user_id: number;
	direction: IDirectionMove;
}

export interface IGameSession {
	game_id: number;
	player1: IUser;
	player2: IUser;
	spectators: IUser[];
	launchTime: Date;
}

export interface userInfoSocket {
	user: Partial<IUser>;
	socket: Socket;
}

//vive le cpp
export class Stack<T> {
	private elements: T[] = [];

	push(element: T): void {    this.elements.push(element);	}
	pop(): T | undefined {	    return this.elements.pop();	}
	peek(): T | undefined {	    return this.elements[this.elements.length - 1];	}
	isEmpty(): boolean {	      return this.elements.length === 0;}
	size(): number {            return this.elements.length;}
}