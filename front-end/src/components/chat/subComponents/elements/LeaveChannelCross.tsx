import { wsChatEvents } from '@/components/api/WsReq';
import { channelsDTO } from '@/shared/DTO/InterfaceDTO';
import React from 'react'
import { Socket } from 'socket.io-client';

 export default function LeaveChannelCross({onClickFunction}:{onClickFunction: Function}) {


	// function leaveChan(channelLeaveID: number) {
	// 	const leavedChannel: channelsDTO.ILeaveChannelDTOPipe = {channelID: channelLeaveID}
	// 	wsChatEvents.leaveRoom(socket, leavedChannel)
	// }


	return (
		<div className='text-red-800 font-bold z-0'
					onClick={(event) => {
						event.stopPropagation();
						onClickFunction();
					}}
		>❌</div>
	)
}


