import React, { useContext, useEffect, useState } from 'react'
import './game.css'
import { IUser } from '@/shared/types'
import { wsChatEvents } from '../api/WsReq'
import { channelsDTO } from '@/shared/DTO/InterfaceDTO'
import { SocketContextGame } from '@/context/globalContext'


export default function ChallengeList() {
  const socket      												= useContext(SocketContextGame);
	const [challengeList, setChallengeList] 	= useState<IUser[]>([]);

	useEffect(() => {

	}, [])


	const challengeButton = (userTarget: IUser) => {
	
	return <>
		<button>{userTarget.login}</button>
		
	</>
	}
	const challengeElement = (userTarget: IUser) => {

		if (socket)
			wsChatEvents.challenge(socket, {targetID: userTarget.UserID} );
	}

	return (
		<div className='flex-col pl-10 noScrollbar'>
			<div className='pt-10 ml-10'>Challenge en cours</div>
			<div className='max-h-60 overflow-y-auto noScrollbar '>
				<li>User1</li>
				<li>User1</li>
				<li>User1</li>
				<li>User1</li>
				<li>User1</li>
				<li>User1</li>
				<li>User1</li>
				<li>User1</li>
				<li>User1</li>
				<li>User1</li>
				<li>User1</li>
				<li>User1</li>
				<li>User1</li>
				<li>User1</li>
				<li>User1</li>
				<li>User1</li>
			</div>
		</div>
	)
}
