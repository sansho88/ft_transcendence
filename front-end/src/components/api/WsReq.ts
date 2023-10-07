import { Socket } from "socket.io-client";
import { wsChatRoutesBack, wsChatRoutesClient } from "@/shared/routesApi";
import { IChannel, IChannelMessage } from "@/shared/typesChannel";
import { channelsDTO, messageDTO} from "@/shared/DTO/InterfaceDTO"
import { IChannelEntity } from "@/shared/entities/IChannel.entity";
import { channel } from "diagnostics_channel";

export namespace wsChatEvents { 

  export function createRoom(socket: Socket, newChannel: channelsDTO.ICreateChannelDTOPipe) {
    socket.emit(wsChatRoutesBack.createRoom(), newChannel);}

  export function joinRoom(socket: Socket, joinChannel: channelsDTO.IJoinChannelDTOPipe) {
    socket.emit(wsChatRoutesBack.joinRoom(), joinChannel);}

  export function leaveRoom(socket: Socket, leaveChannel: channelsDTO.ILeaveChannelDTOPipe) {
    socket.emit(wsChatRoutesBack.joinRoom(), leaveChannel);}

  export function sendMsg(socket: Socket, newMessage: messageDTO.ISendMessageDTOPipe) {
    socket.emit(wsChatRoutesBack.sendMsg(), newMessage);}

  export function pingUpdateChannelsJoined(socket: Socket) {
    socket.emit(wsChatRoutesClient.updateChannelsJoined())
  }

}


function listenEvent(event: string, socket: Socket, f: Function, arg: any) {
  socket.on(event, () => f(arg));
}

export namespace wsChatListen {


  export function infoRoom(socket: Socket) {
    socket.on(wsChatRoutesBack.infoRoom(), (data: {message: string}) => {
        console.log(`INFO ROOM: ${data.message}`) }) }

  export function createRoomListen(socket: Socket, setter: Function) {
    socket.on(wsChatRoutesBack.createRoom(), (data: {channel: IChannelEntity}) => {
      setter(prevChannels => [...prevChannels, data.channel]);
    })
  }

  export function updateChannelsJoined(socket: Socket, setChannelsJoined: Function) {
    socket.on(wsChatRoutesClient.updateChannelsJoined(), (data: IChannelEntity[]) => { //TODO:
      setChannelsJoined(prevChannels => [...prevChannels, ...data]);
    })
  }

}