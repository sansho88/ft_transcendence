import { Socket } from "socket.io-client";
import { wsChatRoutesBack, wsChatRoutesClient } from "@/shared/routesApi";
import { CreateChannelDTOPipe, IChannel } from "@/shared/typesChannel";
import { IChannelEntity } from "@/shared/entities/IChannel.entity";
import { channel } from "diagnostics_channel";

export namespace wsChatEvents {


  export function createRoom(socket: Socket, newChannel: CreateChannelDTOPipe) {

    socket.emit(wsChatRoutesBack.createRoom(), newChannel);

  }
  export function joinRoom(socket: Socket, newChannel: CreateChannelDTOPipe) {

    socket.emit(wsChatRoutesBack.joinRoom(), newChannel);

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
      console.log('CREATE ROOM: ' + data.channel.name);
      setter(prevChannels => [...prevChannels, data.channel]);
      console.log('ROOM TAB: ' + JSON.stringify(data.channel));
    })
  }

}