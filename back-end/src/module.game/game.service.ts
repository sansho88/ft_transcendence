import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {GameEntity} from 'src/entities/game.entity';
import {UsersService} from 'src/module.users/users.service';
import {Repository} from 'typeorm';
import {UserEntity, UserStatus} from "../entities/user.entity";
import {GameStats} from "../dto/gameStats";

interface levelList {
	userID: number;
	level: number;
}

export interface leaderboard {
	user: UserEntity;
	level: number;
	rank: number;
}

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
			game.player1.UserID === user.UserID
		);
	}

	getLooseGame(user: UserEntity, lstGame: GameEntity[]) {
		return lstGame.filter(game =>
			game.player2.UserID === user.UserID
		);
	}

	getAllGame(user: UserEntity, lstGame: GameEntity[]) {
		return lstGame.filter(game =>
			(game.player1.UserID === user.UserID) || (game.player2.UserID === user.UserID)
		);
	}

	async calAllLevel(lstGame: GameEntity[]) {
		let allLevel: levelList[] = [];
		const lstUser = await this.usersService.findAll();
		lstUser.forEach(user => {
			allLevel.push({userID: user.UserID, level: this.calcLevel(this.getWinGame(user, lstGame).length)});
		});
		return allLevel;
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
		allLevel.sort((a, b) => b.level - a.level).forEach((level, index) => {
			if (level.level === allLevel[userID].level) rank = index + 1;
		});
		return rank;
	}

	async getLeaderboard() {
		const lstGame = await this.getAll();
		const allLevel = await this.calAllLevel(lstGame);
		const lstUser = await this.usersService.findAll();
		let leaderboard: leaderboard[] = [];
		let rank = 1;
		allLevel.sort((a, b) => b.level - a.level).forEach((level, index) => {
			if (index > 0 && level.level < allLevel[index - 1].level) rank++;
			leaderboard.push({
				user: lstUser.find(user => user.UserID === level.userID),
				level: level.level,
				rank: rank,
			});
		});
		return leaderboard;
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

	async endGameStatus(UserID, UserID2?) {
		if (UserID2)
			setTimeout(async () => {
				const user1 = await this.usersService.findOne(UserID);
				if (user1.status != UserStatus.OFFLINE)
					await this.usersService.userStatus(user1, UserStatus.ONLINE)
				const user2 = await this.usersService.findOne(UserID2);
				if (user2.status != UserStatus.OFFLINE)
					await this.usersService.userStatus(user2, UserStatus.ONLINE)
			}, 2000);
		else
			setTimeout(async () => {
				const user1 = await this.usersService.findOne(UserID);
				if (user1.status != UserStatus.OFFLINE)
					await this.usersService.userStatus(user1, UserStatus.ONLINE)
			}, 2000);
	}
}
