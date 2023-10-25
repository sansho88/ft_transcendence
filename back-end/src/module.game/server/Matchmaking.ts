import {EGameMod, userInfoSocket} from 'shared/typesGame';
import {Server, Socket} from 'socket.io';
import {GameSession} from './GameSession';
import {v4 as uuidv4} from "uuid";
import {GameService} from '../game.service';
import {UsersService} from "../../module.users/users.service";
import {UserStatus} from "../../entities/user.entity";


export class Matchmaking {
	private userTab: userInfoSocket[] = [];

	constructor(
		private gameService: GameService,
		private usersService: UsersService,
	) {
	}

	public getUsersNumber(): number {
		return this.userTab.length
	}

	//for check double addition protection in addUser
	public containsUser(user: userInfoSocket): boolean {
		return this.userTab.some(element => element.user.UserID === user.user.UserID);
	}

	//add user if not already present
	public addUser(user: userInfoSocket): void {
		if (!this.containsUser(user)) {
			this.userTab.push(user);
		} else {
			user.socket.emit('alreadyInMatchmaking');
		}
	}

	//remove user if present
	public removeUser(user: userInfoSocket): void {
		if (this.containsUser(user)) {
			this.userTab.map((ref) => {
			})
			this.userTab = this.userTab.filter((userRef) => userRef.user.UserID !== user.user.UserID)
			this.userTab.map((ref) => {
			})
		} 
	}

	//create game instance for 1v1 classic game
	public async createGame(server: Server, game_id: number, gameMod: EGameMod): Promise<GameSession> {
		if (this.getUsersNumber() >= 2) {
			const P1: userInfoSocket = this.userTab.pop();
			await this.usersService.userStatus(await this.usersService.findOne(P1.user.UserID), UserStatus.INGAME);
			const P2: userInfoSocket = this.userTab.pop();
			await this.usersService.userStatus(await this.usersService.findOne(P2.user.UserID), UserStatus.INGAME);
			const startDate: Date = new Date();
			const generateSessionName: string = uuidv4();
			return new GameSession(server, P1, P2, startDate, game_id, gameMod, generateSessionName, this.gameService);
		} 
	}

	public leftConnection(player: Socket) {
		const search = this.userTab.findIndex((user) => user.socket == player)
		if (search !== -1)
			this.removeUser(this.userTab[search]);
	}
}
