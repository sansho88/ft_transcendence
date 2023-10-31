import { wsChatEvents } from '@/components/api/WsReq';
import { channelsDTO } from '@/shared/DTO/InterfaceDTO';
import React from 'react'
import { Socket } from 'socket.io-client';

 export default function LeaveChannelCross({onClickFunction, className}:{onClickFunction: Function, className: string}) {

	return (
		<div className={className}
					onClick={(event) => {
						event.stopPropagation();
						onClickFunction();
					}}
		>❌</div>
	)
}


