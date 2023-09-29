// +---------------------------------------------------------------------+
// |                         CHANNEL INTERFACE                           |
// +---------------------------------------------------------------------+

import { Socket } from "socket.io";
import { IUser } from "./types";

export enum ChannelType {
	PUBLIC, //No password No Privacy
	PROTECTED, //Yes Password No Privacy
	PRIVATE, //Maybe password Yes Privacy
	DIRECT,
}

// export interface IChannel {
//   channelID: number;
//   name: string;
//   type: number;
//   ownerUserID: number;
//   ownerLogin?: string;
// }

export interface IChannel {
  channelID: number;
  owner: IUser;
  name: string;
  type: ChannelType;
  // adminList: User[];
  // userList: User[];
  // messages: Message[];
  // inviteList: Invite[];
  // muteList: Mute[];
  // bannedList: Banned[];
}

export interface IChannelMessage {
  channelID     : number;
  content       : string;
  ownerUser     : IUser;
}




