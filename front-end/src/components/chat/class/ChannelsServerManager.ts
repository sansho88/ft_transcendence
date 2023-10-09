import { Channel } from "./Channel";
import { Socket } from "socket.io-client";

/**
 * Recupere les id et nom des channel public existant
 */
export class ChannelsServerManager {

  private channels: Channel[] = [];

  constructor(socketChat: Socket, updateEvent: string) {
    console.log('contrutor ChannelsServerManager')
      socketChat.on(updateEvent, (data) => {
      
    })

  }


  public addChannel(newChannel: Channel) { this.channels.push(newChannel)};
  public removeChannel(removeChannelID: number) { 
    this.channels = this.channels.filter(channel => channel.getChannelID() !== removeChannelID);  }

  public getChannelById(channelID: number) : Channel | undefined {
    return this.channels.find(channel => channel.getChannelID() === channelID);} 
  
  } 