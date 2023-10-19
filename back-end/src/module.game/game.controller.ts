import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { GameService } from "./game.service";
import { UsersService } from "../module.users/users.service";
import { AuthGuard } from "../module.auth/auth.guard";
import { CurrentUser } from "../module.auth/indentify.user";
import { UserEntity } from "../entities/user.entity";
import { ServerGame } from './server/ServerGame';
import {leaderboard} from "./game.service"
import {checkLimitID} from "../dto.pipe/checkIntData";

@Controller('game')
export class GameController {
	constructor(
		private serverGame: ServerGame, 
		private gameService: GameService,
		private usersService: UsersService,
	) {
	}


	@Get('myGame')
	@UseGuards(AuthGuard)
	async findMine(
		@CurrentUser() user: UserEntity
	) {
		return this.gameService.getAllGame(user, await this.gameService.getAll());
	}

	@Get('myChallenges')
	@UseGuards(AuthGuard)
	async getChallenges(
		@CurrentUser() user: UserEntity
	) {
		return this.serverGame.getAllChallengeUser(user.UserID);
	}

	
	@Get('users/:UserID')
	@UseGuards(AuthGuard)
	async findOther(
		@Param('UserID', ParseIntPipe) targetID: number,
	) {
		checkLimitID(targetID);
		const target = await this.usersService.findOne(targetID);
		return this.gameService.getAllGame(target, await this.gameService.getAll());
	}

	@Get('stats')
	@UseGuards(AuthGuard)
	async getStats(
		@CurrentUser() user: UserEntity
	) {
		return await this.gameService.getStats(user);
	}

	@Get('leaderboard')
	@UseGuards(AuthGuard)
	async getLeaderboard() {
		return await this.gameService.getLeaderboard();
	}

	@Get('stats/:userID')
	@UseGuards(AuthGuard)
	async getStatsUser(
		@Param('userID', ParseIntPipe) targetID,
	) {
		checkLimitID(targetID);
		const target = await this.usersService.findOne(targetID);
		return await this.gameService.getStats(target);
	}
}
