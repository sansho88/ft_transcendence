// +---------------------------------------------------------------------+
// |                         CHANNEL INTERFACE                           |
// +---------------------------------------------------------------------+

import { Socket } from "socket.io";
import { IUser } from "./types";

export enum EChannelType {
	PUBLIC, //No password No Privacy
	PROTECTED, //Yes Password No Privacy
	PRIVATE, //Maybe password Yes Privacy
	DIRECT,
}

export interface IChannel {
  channelID: number;
  owner: IUser;
  name: string;
  type: EChannelType;
  password?: string;
}

export interface IChannelMessage {
	id: number;
	author: IUser;
	sendTime: Date;
	channel: IChannel;
	content: string;
}


