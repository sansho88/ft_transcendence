import { Socket } from "socket.io-client";
import { wsChatRoutesBack, wsChatRoutesClient } from "@/shared/routesApi";
import { IChannel, IChannelMessage } from "@/shared/typesChannel";
import { channelsDTO, messageDTO} from "@/shared/DTO/InterfaceDTO"
import { IChannelEntity } from "@/shared/entities/IChannel.entity";
import { channel } from "diagnostics_channel";
import { IMessageEntity } from "@/shared/entities/IMessage.entity";
import { IChallenge } from "@/shared/types";

export namespace wsChatEvents { 

  export function createRoom(socket: Socket, newChannel: channelsDTO.ICreateChannelDTOPipe) {
    socket.emit(wsChatRoutesBack.createRoom(), newChannel);}

  export function joinRoom(socket: Socket, joinChannel: channelsDTO.IJoinChannelDTOPipe) {
    socket.emit(wsChatRoutesBack.joinRoom(), joinChannel);}

  export function createMP(socket: Socket, userTargetMp: channelsDTO.ICreateMpDTOPPipe) {
    socket.emit(wsChatRoutesBack.createMP(), userTargetMp);}

  export function leaveRoom(socket: Socket, leaveChannel: channelsDTO.ILeaveChannelDTOPipe) {
    socket.emit(wsChatRoutesBack.leaveRoom(), leaveChannel);
  }

  export function sendMsg(socket: Socket, newMessage: messageDTO.ISendMessageDTOPipe) {
    socket.emit(wsChatRoutesBack.sendMsg(), newMessage);}

  export function updateChannel(socket: Socket, channel: channelsDTO.IChangeChannelDTOPipe) {
    socket.emit(wsChatRoutesBack.updateRoom(), channel);}

  export function pingUpdateChannelsJoined(socket: Socket) {
    socket.emit(wsChatRoutesClient.updateChannelsJoined())
  }

}

export namespace wsGameEvents { 
  export function createChallenge(socketGame: Socket, userTargetChallenge: channelsDTO.ICreateChallengeDTO) {
    socketGame.emit(wsChatRoutesBack.createChallenge(), userTargetChallenge);}
}
export namespace wsGameListen {
  export function proposeChallengeListen(socket: Socket, userTargetChallenge: channelsDTO.IChallengeProposeDTO) {
    socket.emit(wsChatRoutesClient.proposeChallenge(), userTargetChallenge);}
}
export namespace wsChatListen {




  export function createRoomListen(socket: Socket, setter: Function) {
    socket.on(wsChatRoutesBack.createRoom(), (data: {channel: IChannelEntity}) => {
      setter(prevChannels => [...prevChannels, data.channel]);
    })
  }

  function leaveChanHandle( socket: Socket, 
                            setter: React.Dispatch<React.SetStateAction<IChannel[]>>, 
                            setCurrentChannel: React.Dispatch<React.SetStateAction<number>>, 
                            channels: IChannel[], 
                            data: {channel: IChannelEntity}) 
  {
    if(data.channel && channels.length > 0)
      setter(prevChannels => prevChannels.filter((channel) => channel.channelID != data.channel.channelID))
    setCurrentChannel(-1);
  }

  export function leaveRoomListen(socket: Socket, setter: React.Dispatch<React.SetStateAction<IChannel[]>>, setCurrentChannel: React.Dispatch<React.SetStateAction<number>>, channels: IChannel[]) {
    socket.on(wsChatRoutesBack.leaveRoom(), (data: {channel: IChannelEntity}) => {
        leaveChanHandle(socket, setter, setCurrentChannel, channels, data);
    })
  }
  export function leaveRoomListenOFF(socket: Socket, setter: React.Dispatch<React.SetStateAction<IChannel[]>>, setCurrentChannel: React.Dispatch<React.SetStateAction<number>>, channels: IChannel[]) {
    socket.off(wsChatRoutesBack.leaveRoom(), (data: {channel: IChannelEntity}) => {
      leaveChanHandle(socket, setter, setCurrentChannel, channels, data);
    })
  }



  export function newChallengeListen(socket: Socket, listChallenge: IChallenge[]) {
    socket.on(wsChatRoutesBack.createChallenge(), (res) => {
    })
  }




  export function updateChannelsJoined(socket: Socket, setChannelsJoined: Function) {
    
    socket.on(wsChatRoutesClient.updateChannelsJoined(), (data: IChannelEntity[]) => {
      setChannelsJoined(prevChannels => [...prevChannels, ...data]);
    })
  }

  export function channelHasChanged(socket: Socket, channels: IChannel[], setChannelsJoined: Function) {
    
    socket.on(wsChatRoutesClient.nameChannelsHasChanged(), (data: IChannelEntity) => {
      const newChannels: IChannel[] = [];
      channels.forEach(channel => {
        if(channel.channelID == data.channelID)
        {
          const modifChan: IChannel = channel;
          modifChan.name = data.name;
          modifChan.type = data.type;
          newChannels.push(modifChan);
        }
        else
          newChannels.push(channel);
      })
      setChannelsJoined(newChannels);
    })
  }

  export function channelHasChangedOFF(socket: Socket, channels: IChannel[], setChannelsJoined: Function) {
    
    socket.on(wsChatRoutesClient.nameChannelsHasChanged(), (data: IChannelEntity) => {
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


  //envoi un ping pour update la liste des user bloked
  export function toggleBlockedUserList(
    socket: Socket, updateBlockedList: Function) {
    socket.on(wsChatRoutesClient.updateBlockedList(), (res) => {
      updateBlockedList();
    
    })
  }

}