// +---------------------------------------------------------------------+
// |                         CHANNEL INTERFACE                           |
// +---------------------------------------------------------------------+

import { Socket } from "socket.io";
import { IUser } from "./types";
import { Channel } from "@/components/chat/subComponents/Channel";

export interface IChannel {
  channelID: number;
  name: string;
  type: number;
  ownerUserID: number;
  ownerLogin?: string;
}

export interface IChannelMessage {
  channelID     : number;
  content       : string;
  ownerUser     : IUser;
}




