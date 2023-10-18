import { wsChatRoutesBack, wsChatRoutesClient } from "shared/routesApi";
import { RemoteSocket, Server, Socket } from "socket.io";
import {v4 as uuidv4} from "uuid";
import {userInfoSocket, EGameMod} from 'shared/typesGame';
import { GameSession } from "./GameSession";
import { channelsDTO } from "shared/DTO/InterfaceDTO";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { IUser } from "shared/types";

interface IChallenge {
	P1: number;
	P2: number;
}

type FCreateGameType = (server: Server, p1: userInfoSocket, p2: userInfoSocket, gameMod: EGameMod) => GameSession;

export class ChallengeManager {

	private challenge: IChallenge;
	private socketP1: userInfoSocket;
	private P2: Partial<IUser>;
	private eventChallenge: string = uuidv4();
	private gameMod: EGameMod;
	private proposeChallenge: channelsDTO.IChallengeProposeDTO;

	constructor(
		server: Server,
		challengerUser: userInfoSocket,
		challengedUser: IUser,
		socketsChallenged: RemoteSocket<DefaultEventsMap, any>[],
		createGameSession: FCreateGameType,
		gameMod: EGameMod		
		){
		this.gameMod = gameMod;
		this.challenge =  {P1: challengerUser.user.UserID, P2: challengedUser.UserID}
		this.socketP1 = challengerUser;
		this.P2 = challengedUser;
		
		this.proposeChallenge = {challenger: this.socketP1.user, eventChallenge: this.eventChallenge, gameMod: this.gameMod }

		//actualiser la liste des challenges en cours aupres des sockets du client concerné
		socketsChallenged.map((socket) => {
			socket.emit(wsChatRoutesClient.proposeChallenge(),  this.proposeChallenge)
		})

		server.on(this.eventChallenge, ((socket: Socket, res: channelsDTO.IChallengeAcceptedDTO) => {
			console.log('Challenge accepted ' + JSON.stringify(res));
			const P2: userInfoSocket = {socket: socket, user: this.P2}
			if(res.response)
				createGameSession(server, this.socketP1, P2, this.gameMod);
			else
			{
				//TODO: Supprimer les challenge
				server.off(this.eventChallenge, () => []);
			}
		}))
	}

	//pour reactualiser la liste des challenges
	public updateChallengeList(socketsChallenged: RemoteSocket<DefaultEventsMap, any>[]) {
				socketsChallenged.map((socket) => {
					socket.emit(wsChatRoutesClient.proposeChallenge(),  this.proposeChallenge)
				})
	}

	public getChallengeUsersID(): number[]{
		return [this.challenge.P1, this.challenge.P2]
	}

	public containUserInChallenge(userId: number) {
		if (userId === this.challenge.P1 || userId === this.challenge.P2)
			return true;
		else
			return false;
	}

	public getProposeChallenge(): channelsDTO.IChallengeProposeDTO {
		return this.proposeChallenge
	}

	public isChallenger(userID: number): boolean {
		return this.socketP1.user.UserID === userID
	}
}