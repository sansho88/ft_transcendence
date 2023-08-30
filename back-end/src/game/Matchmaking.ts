import { userInfoSocket, Stack } from 'shared/typesGame';
import { Server } from 'socket.io';
import { GameSession } from './GameSession';
import { v4 as uuidv4 } from "uuid";


export class Matchmaking {

  private userStack: Stack<userInfoSocket> = new Stack<userInfoSocket>();

  constructor() {}

  public getUsersNumber(): number  { return this.userStack.size() }
  
  //for check double addition protection in addUser
  private containsUser(user: userInfoSocket): boolean {
    for (let element of this.userStack.toArray()) {
      // console.log(`HEY : ${element.user.id_user} ||| ${user.user.id_user}`)
      if (element.user.UserID === user.user.UserID) {
        return true;
      }
    }
    return false;
  }
  
  //add user if not already present
  public addUser(user: userInfoSocket)  : void    { 
    console.log(`result : ${this.containsUser(user)}`)
    if (!this.containsUser(user)) {
      this.userStack.push(user);
    }
    else
    console.log(`User(${user.user.login}) is already in matchmaking list`)
  }
  
  //remove user if present
  public removeUser(user: userInfoSocket): void {
    if (this.containsUser(user)) {
        let array = this.userStack.toArray();
        let index = array.findIndex(u => u.user.UserID === user.user.UserID);
        if (index !== -1) {
            array.splice(index, 1);
            this.userStack = new Stack<userInfoSocket>();
            for (let user of array) {
                this.userStack.push(user);
            }
            console.log(`User(${user.user.login}) has been removed from the matchmaking list`)
        }
    }
    else
        console.log(`User(${user.user.login}) is not in matchmaking list`)
}





  //create game instance for 1v1 classic game
  public createGame(server: Server, game_id: number): GameSession {
    if (this.getUsersNumber() >= 2){
      const P1: userInfoSocket = this.userStack.pop();
      const P2: userInfoSocket = this.userStack.pop();
      const startDate : Date = new Date();
      const generateSessionName : string = uuidv4();
      console.log(`NEW GAME SESSION: ${generateSessionName} | ${P1.user.nickname}(${P1.user.login}) vs ${P2.user.nickname}(${P2.user.login})`);
      return new GameSession(server, P1, P2, startDate, game_id, generateSessionName);
    }
    else
      console.log('Matchmaking: Pas assez de joueurs pour lancer une partie');
  }
}
