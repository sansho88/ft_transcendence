import {Injectable} from '@nestjs/common';
import {Matchmaking} from './Matchmaking';
import {GameSession} from './GameSession';
import {RemoteSocket, Server, Socket} from 'socket.io';
import {userInfoSocket, EGameMod} from 'shared/typesGame';
import {v4 as uuidv4} from "uuid";
import {GameService} from '../game.service';
import { IUser } from 'shared/types';
import { ChallengeManager } from './ChallengeManager'
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { channelsDTO } from 'shared/DTO/InterfaceDTO';
import { UserEntity } from 'src/entities/user.entity';
import {UsersService} from "../../module.users/users.service";
import {UserStatus} from "../../entities/user.entity";

@Injectable()
export class ServerGame {
	// gameService: GameService;
	constructor(
		private gameService: GameService,
		private usersService: UsersService,
	) {
		// server = new Server;
	};

	private matchmaking: Matchmaking = new Matchmaking(this.gameService, this.usersService);
	private matchmakingGhost: Matchmaking = new Matchmaking(this.gameService, this.usersService);
	private gameSession: GameSession[] = [];
	private trainningSession: GameSession[] = []; //pour ne pas les melangers, pas de spectator, donc pas besoin de get cette liste
	private challengeList: ChallengeManager[] = []//FIXME:


	public async addPlayerToMatchmaking(player: userInfoSocket, server: Server) {
		if (!player)
			return;
		this.matchmaking.addUser(player);
		if (this.matchmaking.getUsersNumber() >= 2) {
			this.gameSession.push(await this.matchmaking.createGame(server, this.gameSession.length, EGameMod.classic));
		}

	}

	public async addPlayerToMatchmakingGhost(player: userInfoSocket, server: Server) {
		if (!player)
			return ;
		this.matchmakingGhost.addUser(player);
		if (this.matchmakingGhost.getUsersNumber() >= 2) {
			this.gameSession.push(await this.matchmakingGhost.createGame(server, this.gameSession.length, EGameMod.ghost));
		}
	}

	public removePlayerToMatchmaking(player: userInfoSocket) {
		if (!player)
			return;
		this.matchmaking.removeUser(player);
	}

	public removePlayerToMatchmakingGhost(player: userInfoSocket) {
		if (!player)
			return ;
		this.matchmakingGhost.removeUser(player);
	}

	public async addPlayerInTrainningSession(player: userInfoSocket, server: Server) {
		if (!player)
			return ;
		this.trainningSession.push(await this.createTrainningSessionGame(server, 0, player));
	}

	public getGameSession(game_id: number): GameSession {
		this.gameSession.forEach((game) => {
			if (game.getGameId() === game_id)
				return game;
		})
		return null;
	}

	//create game instance for solo trainnig game
	private async createTrainningSessionGame(server: Server, game_id: number, player: userInfoSocket): Promise<GameSession> {

		const startDate: Date = new Date();
		const generateSessionName: string = uuidv4();
		const usr = await this.usersService.findOne(player.user.UserID);
		this.usersService.userStatus(usr, UserStatus.INGAME);
		return new GameSession(server, player, player, startDate, game_id, EGameMod.trainning, generateSessionName, this.gameService);
	}


	public getAllGameSession(): GameSession[] {
		return this.gameSession;
	}

	public leftConnectionUserMatchmaking(playerSocket: Socket) {
		this.matchmaking.leftConnection(playerSocket)
		this.matchmakingGhost.leftConnection(playerSocket)
	}

	public createGame(server: Server, p1: userInfoSocket, p2: userInfoSocket, gameMod: EGameMod) {
		const startDate: Date = new Date();
		const generateSessionName: string = uuidv4();
		return new GameSession(server, p1, p2, startDate, this.gameSession.length, gameMod, generateSessionName, this.gameService);
	}

	private async cleanChallenge() {
		return this.challengeList = this.challengeList.filter((challenge) => challenge.getIsArchivate() !== true)
	}

	public createChallenge(server: Server, challenger: userInfoSocket, challenged: IUser, gameMod: EGameMod, sockersChallenged: RemoteSocket<DefaultEventsMap, any>[]) {
		this.cleanChallenge();
		if (!this.alreadyInChallenge(challenger.user.UserID))
			this.challengeList.push(new ChallengeManager(server, challenger, challenged, sockersChallenged, this.createGame, gameMod))
		else
			challenger.socket.emit('info', 'Vous etes deja en challenge')
	}

	public alreadyInChallenge(challengerID: number) {
		return this.challengeList.some((elem) => elem.isChallenger(challengerID))
	}

	public getAllChallengeUser(userID: number): channelsDTO.IChallengeProposeDTO [] {
		const list: ChallengeManager[] = this.challengeList.filter((challenge) => challenge.containUserInChallenge(userID) && !challenge.isChallenger(userID))
		const listAllPropose: channelsDTO.IChallengeProposeDTO[] = [];
		list.map((element) => {listAllPropose.push(element.getProposeChallenge())})

		return listAllPropose;
	}

	public async acceptChallenge(server: Server, userP2: UserEntity, socketP2: Socket, event: string) {
		const index = this.challengeList.findIndex((challenge) => challenge.getEventChallenge() === event)
		if (index >= 0){
			const P1: userInfoSocket = this.challengeList[index].socketP1;
			const P2: userInfoSocket = {user: userP2, socket: socketP2};
			const gameMod: EGameMod = this.challengeList[index].gameMod;
			this.usersService.userStatus(await this.usersService.findOne(P1.user.UserID), UserStatus.INGAME);
			this.usersService.userStatus(await this.usersService.findOne(P2.user.UserID), UserStatus.INGAME);
			this.createGame(server, P1, P2, gameMod);
			this.challengeList[index].cancelChallenge();
		}

	}
	
	public declineChallenge(userP2: UserEntity, event: string){
		const index = this.challengeList.findIndex((challenge) => challenge.getEventChallenge() === event)
		if (index >= 0){
			if (this.challengeList[index].containUserInChallenge(userP2.UserID) === true)
				this.challengeList[index].cancelChallenge();
		}
	}


	userInMatchmakingGhost(player: userInfoSocket) {
		return this.matchmakingGhost.containsUser(player)
	}
	userInMatchmaking(player: userInfoSocket) {
		return this.matchmaking.containsUser(player);
	}
}