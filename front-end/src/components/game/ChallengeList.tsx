import React, { useContext, useEffect, useState } from 'react'
import './game.css'
import { IUser } from '@/shared/types'
import { wsChatEvents, wsChatListen } from '../api/WsReq'
import { channelsDTO } from '@/shared/DTO/InterfaceDTO'
import { SocketContextGame } from '@/context/globalContext'
import { wsChatRoutesBack, wsChatRoutesClient } from '@/shared/routesApi'
import * as apiReq from '@/components/api/ApiReq'
import { EStatusFrontGame } from '@/shared/typesGame'
import {v4 as uuidv4} from "uuid";
import { eventNames } from 'process'



export default function ChallengeList({currentStepGameFront}: {currentStepGameFront: EStatusFrontGame}) { //FIXME: props useless ?
  const socket      												= useContext(SocketContextGame);
	const [challengeList, setChallengeList] 	= useState<channelsDTO.IChallengeProposeDTO[]>([]);
  const [challengeEvent, setChallengeEvent] = useState<string>("");

	

	useEffect(() => {
		setTimeout(() => {
		
			console.log('socket connect ? : ' , socket?.connected)
			if (socket?.disconnected)
			{	
				socket.connect();
			}

			socket?.on('info', (data: string) => {
				console.log('Et bah enfin ! ' , data)
			})

			socket?.on('challenge', (data: string) => {
				console.log(`WS challenge recu: ${JSON.stringify(data)}`);
				setChallengeEvent(data);
			})

			socket?.on(wsChatRoutesClient.proposeChallenge(), (/*data: channelsDTO.IChallengeProposeDTO*/) => {
				challengeElement();
			})
		}, 100)
		
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
		<div className='flex bg-slate-400 max-w-max p-1 mt-1 rounded-md' key={uuidv4()}>
			{`${challenge.challenger.nickname}(${challenge.challenger.login})`} 
			<button onClick={() => acceptChallenge(challenge)}>✅</button>
			<button onClick={()=> declineChallenge(challenge)}>❌</button>
		</div>
		)
	}
	







	return (
		<div className='flex-col pl-10 noScrollbar'>
			<div className='pt-10 ml-10'>Challenge en cours</div>
			<div className='max-h-60 overflow-y-auto noScrollbar '>
				{challengeList.map((elem) => {
					return (challengeButtonListElement(elem))
				})}
			</div>
		</div>
	)
}
