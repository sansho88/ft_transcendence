import { wsChatRoutesBack, wsChatRoutesClient } from "shared/routesApi";
import { RemoteSocket, Server, Socket } from "socket.io";
import {v4 as uuidv4} from "uuid";
import {userInfoSocket, EGameMod, IChallengeManager, IChallengeStepDTO} from 'shared/typesGame';
import { GameSession } from "./GameSession";
import { channelsDTO } from "shared/DTO/InterfaceDTO";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { IUser } from "shared/types";
import { SocketUserList } from "../game.ws";

interface IChallenge {
	P1: number;
	P2: number;
}

type FCreateGameType = (server: Server, p1: userInfoSocket, p2: userInfoSocket, gameMod: EGameMod) => GameSession;

export class ChallengeManager {

	private challenge: IChallenge;
	public socketP1: userInfoSocket;
	private P2: Partial<IUser>;
	private eventChallenge: string = uuidv4();
	public gameMod: EGameMod;
	private proposeChallenge: channelsDTO.IChallengeProposeDTO;
	private socketsChallenged: RemoteSocket<DefaultEventsMap, any>[];
	private server: Server;
	private isArchivate: boolean = false;


	//P1 est le challenger - P2 le challengé
	constructor(
		server: Server,
		challengerUser: userInfoSocket,
		challengedUser: IUser,
		socketsChallenged: RemoteSocket<DefaultEventsMap, any>[],
		createGameSession: FCreateGameType,
		gameMod: EGameMod		
		){
		this.server = server;
		this.gameMod = gameMod;
		this.challenge =  {P1: challengerUser.user.UserID, P2: challengedUser.UserID}
		this.socketP1 = challengerUser;
		this.P2 = challengedUser;
		this.socketsChallenged = socketsChallenged;

		const tmp: IChallengeStepDTO = {challengerequested: true}
		this.socketP1.socket.emit('challengeStep', tmp);

		this.socketP1.socket.on('cancelChallenge', ()=> {
			console.log('coucou cancel')
			// this.socketP1.socket.emit('challengeStep', {challengerequested: false});
			this.cancelChallenge()
		});

		this.socketP1.socket.on('disconnect', ()=> {
			// this.socketP1.socket.emit('challengeStep', {challengerequested: false});
			this.cancelChallenge()
		});
		
		this.proposeChallenge = {challenger: this.socketP1.user, eventChallenge: this.eventChallenge, gameMod: this.gameMod }

		//actualiser la liste des challenges en cours aupres des sockets du client concerné
		this.socketsChallenged.map((socket) => {
			socket.emit(wsChatRoutesClient.proposeChallenge(),  this.proposeChallenge)
			socket.emit('info',  'Wesh les boloss')
			// socket.on(this.eventChallenge, (res) => {
			// console.log('LA POUTAA DE SA MAMA')
			// })
		})

		server.on(this.eventChallenge, ((socket: Socket, res: channelsDTO.IChallengeAcceptedDTO) => {
			console.log('Challenge accepted ' + JSON.stringify(res));

			const P2: userInfoSocket = {socket: socket, user: this.P2}
			if(res.response)
				createGameSession(server, this.socketP1, P2, this.gameMod);
			else
				this.cancelChallenge();
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
		if (userId === null)
			return false;
		if (userId === this.challenge.P1 || userId === this.challenge.P2)
			return true;
		else
			return false;
	}

	public getProposeChallenge(): channelsDTO.IChallengeProposeDTO {
		return this.proposeChallenge
	}

	public isChallenger(userID: number): boolean {
		if (userID == null)
			return false;
		else
			return this.socketP1.user.UserID === userID
	}
	
	public cancelChallenge(){
		this.isArchivate = true;
		this.eventChallenge = '';
		this.challenge.P1 = -1;
		this.challenge.P2 = -1;
		if (this.socketP1.socket != null){
			const tmp: IChallengeStepDTO = {challengerequested: false}
			this.socketP1.socket.emit('challengeStep', tmp);
		}
		// this.socketP1.user = null;
		// this.socketP1.socket = null;
		// this.server.off(this.eventChallenge, () => []);
		//TODO: ping les clients pour refresh les list challenges
	}

	// public challengeDone

	public getIsArchivate(): boolean{
		return this.isArchivate;
	}

	public getEventChallenge() : string {
		return this.eventChallenge;
	}
}