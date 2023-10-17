import { wsChatRoutesBack } from "shared/routesApi";
import { Socket } from "socket.io";
import {v4 as uuidv4} from "uuid";
import {userInfoSocket, EGameMod} from 'shared/typesGame';

interface IChallenge {
	P1: number,
	P2: number
}

export class ChallengeManager {

	private challenge: IChallenge;
	private eventChallenge: string = uuidv4();
	constructor(server: Socket, challenger: userInfoSocket, targetChallengeUserId: number){
		this.challenge =  {P1: challenger.user.UserID, P2: targetChallengeUserId}

		server.emit()
		
		server.on(this.eventChallenge, ((res: userInfoSocket) => {
			
		}))
	}


	// private createChallenge(idP1: userInfoSocket, idP2: number){
		
	// }

}