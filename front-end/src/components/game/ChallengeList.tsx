import React, { useContext, useEffect, useState } from 'react'
import './game.css'
import { IUser } from '@/shared/types'
import { wsChatEvents, wsChatListen } from '../api/WsReq'
import { channelsDTO } from '@/shared/DTO/InterfaceDTO'
import { SocketContextGame } from '@/context/globalContext'
import { wsChatRoutesBack, wsChatRoutesClient } from '@/shared/routesApi'
import * as apiReq from '@/components/api/ApiReq'
import { EGameMod, EStatusFrontGame } from '@/shared/typesGame'
import {v4 as uuidv4} from "uuid";
import { eventNames } from 'process'

export default function ChallengeList({currentStepGameFront}: {currentStepGameFront: EStatusFrontGame}) { //FIXME: props useless ?
  const socket      												= useContext(SocketContextGame);
	const [challengeList, setChallengeList] 	= useState<channelsDTO.IChallengeProposeDTO[]>([]);	

	useEffect(() => {
		setTimeout(() => {
			if (socket?.disconnected)
				socket.connect();

			socket?.on(wsChatRoutesClient.proposeChallenge(), (/*data: channelsDTO.IChallengeProposeDTO*/) => {
				challengeElement();
			})
		}, 200) // petit timeout pour laisser les autres componenets / socket se monter avant
		challengeElement();
	}, [])
	
	//get la list des challenge via api REST
	const challengeElement = async () => {
		await apiReq.getApi.getMyChallenges()
		.then((res: channelsDTO.IChallengeProposeDTO[]) => {
			console.log(JSON.stringify(res.data))
			setChallengeList(res.data);
		})
	}


	function acceptChallenge(challenge: channelsDTO.IChallengeProposeDTO){
		const tmp: channelsDTO.IChallengeAcceptedDTO = {response: true, event: challenge.eventChallenge}
		console.log('ACCEPT CHALLENGE: ' , challenge.eventChallenge)
		socket?.emit(wsChatRoutesBack.responseChallenge(), tmp);
	}

	function declineChallenge(challenge: channelsDTO.IChallengeProposeDTO){
		const tmp: channelsDTO.IChallengeAcceptedDTO = {response: false, event: challenge.eventChallenge}
		console.log('DECLINE CHALLENGE: ' , challenge.eventChallenge)
		socket?.emit(wsChatRoutesBack.responseChallenge(), tmp);
		challengeElement();
	}

	const challengeButtonListElement = (challenge: channelsDTO.IChallengeProposeDTO) => {

		return (
			<div className='flex  max-w-max p-1 mt-1 rounded-md space-x-1' key={uuidv4()}>
				<div className='mr-2'>
					{`${challenge.challenger.nickname}(${challenge.challenger.login}) |`}
					{challenge.gameMod === EGameMod.classic ? ' classic ' : ' ghost '} 
				</div>
				<button onClick={() => acceptChallenge(challenge)} title='Accept'>✅</button>
				<button onClick={()=> declineChallenge(challenge)} title='Decline'>❌</button>
			</div>
			)
		}


	return (
		<div className='flex-col pl-12 noScrollbar'>
			<div className='pt-10 ml-10'>{challengeList.length > 0 ? 'CHALLENGES:' : ''}</div>
			<div className='max-h-60 overflow-y-auto noScrollbar '>
				{challengeList.map((elem) => {
					return (challengeButtonListElement(elem))
				})}
			</div>
		</div>
	)
}
