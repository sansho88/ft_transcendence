import { IUser } from './types';
import { Socket } from 'socket.io';

// +---------------------------------------------------------------------+
// |                           GAME INTERFACE                            |
// +---------------------------------------------------------------------+

export class GameTheme {
  public neon           = 'game-theme-neon';
  public classicPong    = 'game-theme-classic-pong';
  public sunset         = 'game-theme-sunset'
}

export enum EGameMod {
  classic,
  ghost,
  trainning,
  rumble
}

export enum EInfoType {
  error,
  errorAlreadyInGame,
  gameFind,
}

export enum EStatusFrontGame {
  idle,
  modChoice,
  matchmakingRequest,
  gameSessionFind,
  waiting,
  countdown,
  gameInProgress,
  endOfGame,
  challengeRequest
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
  ballIsHidden      : boolean;
  // spectators: Partial<IUser>[];
}


export interface IChallengeManager{
  
}

export interface IChallengeStepDTO {
  challengerequested: boolean;
  
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
  ballIsHidden      : boolean;
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
