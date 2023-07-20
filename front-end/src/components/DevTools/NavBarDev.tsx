'use client'
import Link from 'next/link'
import React, {useState, createContext, useContext, } from 'react'
import {UserContext, LoggedContext} from "@/context/GameContext";


export function NavBar({className}: {className: string}) {

	const {userContext, setUserContext} = useContext(UserContext);

	const [username, setUsername] = useState('')
	const {logged} = useContext(LoggedContext);


	function SubNav() {

		return (
			<>
				<Link href="/home">HOME</Link>
				<Link href="/game">GAME PROTO</Link>
				<Link href="/chat_room">CHATROOM PROTO</Link>
				<Link href={`/profile/${userContext?.login}`}>PROFILE</Link>
				<div className='flex  flex-col'>debug: actif user: {userContext?.login}</div>
			</>
		)
	}
	
	function SubNavNotLog() {
		
		return (
			<>
				<Link href="/home">HOME</Link>
				<Link href="/login">LOGIN</Link>
				<div className=' text-red-500'>user:(not logged)</div>
			</>
		)
	}

	return (
		<>
				<div className={className}>
					<div className="h-10 flex justify-center items-center space-x-10">
						<div className=' text-red-500 absolute left-5'>Navbar Dev	</div>
						{logged ? <SubNav /> : <SubNavNotLog />}
				</div>
			</div>
		</>
	);
}