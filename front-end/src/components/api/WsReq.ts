import { Socket } from "socket.io-client";
import { wsChatRoutesBack, wsChatRoutesClient } from "@/shared/routesApi";
import { IChannel, IChannelMessage } from "@/shared/typesChannel";
import { channelsDTO, messageDTO} from "@/shared/DTO/InterfaceDTO"
import { IChannelEntity } from "@/shared/entities/IChannel.entity";
import { channel } from "diagnostics_channel";
import { IMessageEntity } from "@/shared/entities/IMessage.entity";

export namespace wsChatEvents { 

  export function createRoom(socket: Socket, newChannel: channelsDTO.ICreateChannelDTOPipe) {
    socket.emit(wsChatRoutesBack.createRoom(), newChannel);}

  export function joinRoom(socket: Socket, joinChannel: channelsDTO.IJoinChannelDTOPipe) {
    socket.emit(wsChatRoutesBack.joinRoom(), joinChannel);}

  export function leaveRoom(socket: Socket, leaveChannel: channelsDTO.ILeaveChannelDTOPipe) {
    socket.emit(wsChatRoutesBack.joinRoom(), leaveChannel);}

  export function sendMsg(socket: Socket, newMessage: messageDTO.ISendMessageDTOPipe) {
    socket.emit(wsChatRoutesBack.sendMsg(), newMessage);}

  export function updateChannel(socket: Socket, channel: channelsDTO.IChangeChannelDTOPipe) {
    socket.emit(wsChatRoutesBack.updateRoom(), channel);}

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

  export function leaveRoomListen(socket: Socket, setter: React.Dispatch<React.SetStateAction<IChannel[]>>) {
    socket.on(wsChatRoutesBack.leaveRoom(), (data: {channel: IChannelEntity}) => {
      // setter(prevChannels => [...prevChannels, data.channel]);//TODO: delete chanel
      setter(prevChannels => prevChannels.filter((channel) => channel.channelID != data.channel.channelID))
    })
  }

  export function updateChannelsJoined(socket: Socket, setChannelsJoined: Function) {
    
    socket.on(wsChatRoutesClient.updateChannelsJoined(), (data: IChannelEntity[]) => { //TODO:
      setChannelsJoined(prevChannels => [...prevChannels, ...data]);
    })
  }

  export function channelHasChanged(socket: Socket, channels: IChannel[], setChannelsJoined: Function) {
    
    socket.on(wsChatRoutesClient.nameChannelsHasChanged(), (data: IChannelEntity) => { //TODO:
      const newChannels: IChannel[] = [];
      channels.forEach(channel => {
        if(channel.channelID == data.channelID)
        {
          const modifChan: IChannel = channel;
          modifChan.name = data.name;
          newChannels.push(modifChan);
        }
        else
          newChannels.push(channel);
      })
      setChannelsJoined(newChannels);
    })
  }

  export function channelHasChangedOFF(socket: Socket, channels: IChannel[], setChannelsJoined: Function) {
    
    socket.on(wsChatRoutesClient.nameChannelsHasChanged(), (data: IChannelEntity) => { //TODO:
      const newChannels: IChannel[] = [];
      channels.forEach(channel => {
        if(channel.channelID == data.channelID)
        {
          const modifChan: IChannel = channel;
          modifChan.name = data.name;
          newChannels.push(modifChan);
        }
        else
          newChannels.push(channel);
      })
      setChannelsJoined(newChannels);
    })
  }



  /*---------------------------------------------- NEW MESSAGE MANAGE WS ------------------------------------------------ */
  const newMessageHandler = ( socket: Socket, 
                              setMessages: React.Dispatch<React.SetStateAction<messageDTO.IReceivedMessageEventDTO[]>>, 
                              currentChannel: number,
                              message: messageDTO.IReceivedMessageEventDTO) => {
    if (message.channelID === currentChannel)
        setMessages(prevMessages => [...prevMessages, message]);
  }

  export function newMessageListen(
    socket: Socket, 
    setMessages: React.Dispatch<React.SetStateAction<messageDTO.IReceivedMessageEventDTO[]>>, 
    currentChannel: number) {
    socket.off(wsChatRoutesBack.sendMsg(), (message: messageDTO.IReceivedMessageEventDTO) => {
      newMessageHandler(socket, setMessages, currentChannel, message);
    });

    socket.on(wsChatRoutesBack.sendMsg(), (message: messageDTO.IReceivedMessageEventDTO) => {
      newMessageHandler(socket, setMessages, currentChannel, message);
    })
  }
  
  export function newMessageListenOFF(
    socket: Socket, 
    setMessages: React.Dispatch<React.SetStateAction<messageDTO.IReceivedMessageEventDTO[]>>, 
    currentChannel: number) {
    socket.off(wsChatRoutesBack.sendMsg(), (message: messageDTO.IReceivedMessageEventDTO) => {
      newMessageHandler(socket, setMessages, currentChannel, message);
    })
  }



}