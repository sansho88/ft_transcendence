import { Channel } from "./Channel";

export class ChannelsManager {

  private channels: Channel[] = [];

  constructor() {}


  
  public addChannel(newChannel: Channel) { this.channels.push(newChannel)};
  public removeChannel(removeChannelID: number) { 
    this.channels = this.channels.filter(channel => channel.getChannelID() !== removeChannelID);  }

  public getChannelById(channelID: number) : Channel | undefined {
    return this.channels.find(channel => channel.getChannelID() === channelID);}


}