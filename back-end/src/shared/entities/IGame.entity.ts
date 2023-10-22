import { IUserEntity } from './IUser.entity';

enum GameState {
	requested,
	inProgress,
	p1Win,
	p2Win,
}

export interface IGameEntity{
	ID: number;
	player1: IUserEntity;
	player2: IUserEntity;
	score1: number;
	score2: number;
	starting_date: Date;
	state: GameState;
}
