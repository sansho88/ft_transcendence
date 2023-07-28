'use client'
import Link from 'next/link'
import React, {useState, useContext, useEffect, } from 'react'
import {UserContext, LoggedContext} from "@/context/globalContext";
import { useRouter } from 'next/navigation';



export function NavBar({className}: {className: string}) {

	const {userContext, setUserContext} = useContext(UserContext);
	const {logged, setLogged} = useContext(LoggedContext);
	const [isHidden, setIsHidden] = useState(true);
	const router = useRouter();

	useEffect(()=> {
		if (!logged)
			router.push('/auth')
		else
			setIsHidden(true);
	}, [logged])

	const [infoUser, setInfoUser] = useState<JSX.Element>(<></>)

useEffect(() => {
	setInfoUser(
	<div className='flex'>id:
	<div className=' text-red-700'>{userContext?.id_user}</div>
	|
	<div className=' text-green-700'>{userContext?.login}</div>
	|
	<div className=' text-violet-700'>{userContext?.nickname}</div>
</div>)
}, [userContext])


	function SubNav() {

		return (
			<>
				<Link href="/">HOME</Link>
				<Link href="/proto/game">GAME</Link>
				<Link href="/proto/chat">CHATROOM</Link>
				<Link href={`/profile/${userContext?.login}`}>PROFILE</Link>
				{infoUser}
				<button onClick={() => {setLogged(false);localStorage.removeItem("login");}}> DISCONNECT </button>
			</>
		)
	}
	
	function SubNavNotLog() {
		
		return (
			<>
				<Link href="/">HOME</Link>
				<Link href="/auth">AUTH LOGIN</Link>
				{/* <Link href="/login">OLD LOGIN</Link> */}
				<div className=' text-red-500'>user:(not logged)</div>
			</>
		)
	}

	
	return (
		<>
			{isHidden ? (
					<div className='absolute bottom-0 left-[48vw] w-auto rounded-t-xl  px-2 bg-slate-800 opacity-40'>
						<div className="h-10 flex justify-center items-center space-x-10">
							<button onClick={() => setIsHidden(false)}> devbar </button>
						</div>
					</div>
			) : (
				<div className={className}>
					<div className="h-10 flex justify-center items-center space-x-10">
						<div className=" text-red-500 absolute left-5">Navbar Dev </div>
						{logged ? <SubNav /> : <SubNavNotLog />}
						
						<button onClick={() => setIsHidden(true)}> ❌ </button>
					</div>
				</div>
			)}
		</>
	);
}