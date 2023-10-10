import { SocketContextChat } from "@/context/globalContext";
import { IMessageEntity } from "@/shared/entities/IMessage.entity";
import { IChannel, IChannelMessage } from "@/shared/typesChannel";
import { Socket } from "socket.io-client";

/**
 * class channel pour gerer la logique par channel individuel, contenant les messages et users
 */
export class Channel {

  private chanInfo        : IChannel;

  private messages        : IMessageEntity[] = [];         // liste de tous les messages du chan
  private banListUserID   : number[] = [];                  // liste des userID ban dans le channel
  private hasPassword     : boolean = false;                // password requis ?
  private isPrivate       : boolean = false;                // channel caché/private ?
  private adminUserID     : number[] = [];
  private socketChat      : Socket;


  constructor(chanInfo: IChannel, userSocket: Socket) {
    this.chanInfo = chanInfo;
    this.adminUserID.push(this.chanInfo.owner.UserID)        // owner is first admin
    
    if (this.chanInfo.type === 2)                           // 0 = public / 1 = private / 2 = protected
      this.hasPassword = true;
    else if (this.chanInfo.type === 1)
      this.isPrivate = true

    this.socketChat = userSocket;

    this.apiGetMessages();
    this.getBanUsers();
    //EVENT WEBSOCKET SUBSCRIBE
    if (this.socketChat){
      this.socketChat.on('newMessage', (newMessage: IMessageEntity) => {this.addMessage(newMessage)})        //subscrite event newMessage => ajouter chaque nouveau message en fin de list
      this.socketChat.on('banList', (banListUserID: number) => {  })                                          //subscrite event banList => update banList in realtime
    }
  }

  private apiGetMessages(): IMessageEntity[] {
    //TODO: get messages
    
     return []}
  private getBanUsers() { /* REQUETE API pour get les ban du channel */; }

  private addMessagesBefore(messages: IMessageEntity[]) {  messages.forEach((message) => {this.messages = [message, ...this.messages]}) }
  private addMessageBefore(message: IMessageEntity) {      this.messages = [message, ...this.messages] }

  private addMessages(messages: IMessageEntity[]) {        messages.forEach((message) => {this.messages.push(message)}) }
  private addMessage(message: IMessageEntity) {            this.messages.push(message) }



  public getOldMessages(targetDate: Date) {}    //demander 10 messages plus ancien a partir de <targetDate> // pour smooth loading on scrolling up
  public setOwnerUser(userID: number, userLogin: string) { this.chanInfo.owner.UserID = userID, this.chanInfo.owner.login = userLogin}
  public getChannelID(): number {return this.chanInfo.channelID};

  public getIsPrivate(): boolean {return this.isPrivate}

}