import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {GameEntity} from 'src/entities/game.entity';
import {UsersService} from 'src/module.users/users.service';
import {Repository} from 'typeorm';
import {UserEntity} from "../entities/user.entity";
import {GameStats} from "../dto/gameStats";

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(GameEntity)
		private gameRepository: Repository<GameEntity>,
		private usersService: UsersService,
	) {
	}

	async create(
		player1ID: number,
		player2ID: number,
		score1: number,
		score2: number,
		starting_date: Date,
	) {
		const player1 = await this.usersService.findOne((score1 > score2) ? player1ID : player2ID);
		const player2 = await this.usersService.findOne((score1 < score2) ? player1ID : player2ID);

		const game = this.gameRepository.create({
			player1,
			player2,
			score1: Math.max(score2, score1),
			score2: Math.min(score2, score1),
			starting_date,
		})
		await game.save();
		return game;
	}


	async getAll() {
		return await this.gameRepository.find({
			relations: ['player1', 'player2']
		})
	}

	getWinGame(user: UserEntity, lstGame: GameEntity[]) {
		return lstGame.filter(game =>
			game.player1.UserID == user.UserID
		);
	}

	getLooseGame(user: UserEntity, lstGame: GameEntity[]) {
		return lstGame.filter(game =>
			game.player1.UserID == user.UserID
		);
	}

	getAllGame(user: UserEntity, lstGame: GameEntity[]) {
		return lstGame.filter(game =>
			(game.player1.UserID == user.UserID) || (game.player2.UserID == user.UserID)
		);
	}

	async calAllLevel(lstGame: GameEntity[]) {
		return (await this.usersService.findAll()).map(user =>
			lstGame.filter(game =>
				user.UserID == game.player1.UserID
			).length
		)
	}

	calcLevel(exp: number): number {
		let a = 1;
		let b = 2;
		let level = 1;
		while (exp > a) {
			a += b;
			b = a;
			level++;
		}
		return level;
	}

	async getRankUser(lstGame: GameEntity[], userID: number) {
		userID--;
		let rank = 1;
		const allLevel = await this.calAllLevel(lstGame);
		for (let i = 0; i < allLevel.length; i++)
			if (allLevel[i] > allLevel[userID])
				rank++;
		return rank;
	}

	async getStats(user: any) {
		const lstGame = await this.getAll();

		const nbWin = this.getWinGame(user, lstGame).length
		const nbLoose = this.getLooseGame(user, lstGame).length
		const exp = nbWin;
		const level = this.calcLevel(exp);
		const rank = await this.getRankUser(lstGame, user.UserID);

		const stats: GameStats = {
			nbWin,
			nbLoose,
			level,
			exp,
			rank,
		};
		return stats;
	}
}
