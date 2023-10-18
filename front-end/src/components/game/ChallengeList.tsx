import React, { useContext, useEffect, useState } from 'react'
import './game.css'
import { IUser } from '@/shared/types'
import { wsChatEvents, wsChatListen } from '../api/WsReq'
import { channelsDTO } from '@/shared/DTO/InterfaceDTO'
import { SocketContextGame } from '@/context/globalContext'
import { wsChatRoutesBack } from '@/shared/routesApi'
import * as apiReq from '@/components/api/ApiReq'
import { EGameMod } from '@/shared/typesGame'
import {v4 as uuidv4} from "uuid";



export default function ChallengeList() {
  const socket      												= useContext(SocketContextGame);
	const [challengeList, setChallengeList] 	= useState<channelsDTO.IChallengeProposeDTO[]>([]);

	useEffect(() => {
		socket?.on(wsChatRoutesBack.createChallenge(), (data: any) => {
			console.log(JSON.stringify(data));
		})

	}, [])


	const challengeButton = (challenge: channelsDTO.IChallengeProposeDTO) => {
	
	return (
		<div className='flex bg-slate-400 max-w-max p-1 mt-1 rounded-md' key={uuidv4()}>
			{`${challenge.challenger.nickname}(${challenge.challenger.login})`} 
			<button onClick={()=>console.log('ACCEPT CHALLENGE')}>✅</button>
			<button onClick={()=>console.log('REFUSAL CHALLENGE')}>❌</button>
		</div>
		)
	}
	
	useEffect(() => {
	const challengeElement = async () => {

		await apiReq.getApi.getMyChallenges()
		.then((res: channelsDTO.IChallengeProposeDTO[]) => {
			console.log(JSON.stringify(res.data))
			setChallengeList(res.data);
		})
	}
	challengeElement();

	}, [])



	return (
		<div className='flex-col pl-10 noScrollbar'>
			<div className='pt-10 ml-10'>Challenge en cours</div>
			<div className='max-h-60 overflow-y-auto noScrollbar '>
				{challengeList.map((elem) => {
				
					return (challengeButton(elem))
				})}
			</div>
		</div>
	)
}
