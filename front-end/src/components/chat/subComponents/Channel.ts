import { SocketContextChat } from "@/context/globalContext";
import { IChannel, IChannelMessage } from "@/shared/typesChannel";
import { Socket } from "socket.io-client";

/**
 * class channel pour gerer la logique par channel individuel, contenant les messages et users
 */
export class Channel {

  private chanInfo        : IChannel;

  private messages        : IChannelMessage[] = [];         // liste de tous les messages du chan
  private banListUserID   : number[] = [];                  // liste des userID ban dans le channel
  private hasPassword     : boolean = false;                // password requis ?
  private isPrivate       : boolean = false;                // channel caché/private ?
  private adminUserID     : number[] = [];
  private socketChat      : Socket;


  constructor(chanInfo: IChannel, userSocket: Socket) {
    this.chanInfo = chanInfo;
    this.adminUserID.push(this.chanInfo.ownerUserID)        // owner is first admin
    
    if (this.chanInfo.type === 2)                           // 0 = public / 1 = private / 2 = protected
      this.hasPassword = true;
    else if (this.chanInfo.type === 1)
      this.isPrivate = true

    this.socketChat = userSocket;

    this.apiGetMessages();
    this.getBanUsers();
    //EVENT WEBSOCKET SUBSCRIBE
    if (this.socketChat){
      this.socketChat.on('newMessage', (newMessage: IChannelMessage) => {this.addMessage(newMessage)})        //subscrite event newMessage => ajouter chaque nouveau message en fin de list
      this.socketChat.on('banList', (banListUserID: number) => {  })                                          //subscrite event banList => update banList in realtime
    }
  }

  private apiGetMessages(): IChannelMessage[] { /* REQUETE API pour get 30? derniers messages */; return []}
  private getBanUsers() { /* REQUETE API pour get les ban du channel */; }

  private addMessagesBefore(messages: IChannelMessage[]) {  messages.forEach((message) => {this.messages = [message, ...this.messages]}) }
  private addMessageBefore(message: IChannelMessage) {      this.messages = [message, ...this.messages] }

  private addMessages(messages: IChannelMessage[]) {        messages.forEach((message) => {this.messages.push(message)}) }
  private addMessage(message: IChannelMessage) {            this.messages.push(message) }



  public getOldMessages(targetDate: Date) {}    //demander 10 messages plus ancien a partir de <targetDate> // pour smooth loading on scrolling up
  public setOwnerUser(userID: number, userLogin: string) { this.chanInfo.ownerUserID = userID, this.chanInfo.ownerLogin = userLogin}
  public getChannelID(): number {return this.chanInfo.channelID};

}