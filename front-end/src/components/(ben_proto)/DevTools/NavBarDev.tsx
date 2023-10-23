'use client'
import Link from 'next/link'
import React, {useState, useContext, useEffect, } from 'react'
import {UserContext, LoggedContext} from "@/context/globalContext";
import * as apiReq from '@/components/api/ApiReq'



export function NavBar({className}: {className: string}) {

	const {userContext} = useContext(UserContext);
	const {logged, setLogged} = useContext(LoggedContext);
	const [isHovered, setIsHovered] = useState(false);
  const [turnOffAuth, setTurnOffAuth] = useState<boolean>(false);
  // const [isHovered, setIsHovered] = useState(false);

	const [infoUser, setInfoUser] = useState<JSX.Element>(<></>)

  useEffect(() => {
	  setInfoUser(
	  <div className='flex'>id:
	  <div className=' text-red-700'>{userContext?.UserID}</div>
	|
	  <div className=' text-green-700'>{userContext?.login}</div>
	|
	  <div className=' text-violet-700'>{userContext?.nickname}</div>
  </div>)
      return;
  }, [userContext])


  const handleMouseEnter = () => {
      setIsHovered(true);
  }

  const handleMouseLeave = () => {
      setIsHovered(false);
  }


  function Dropdown() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block text-left">
            <div>
                <button type="button" 
                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-sm font-medium text-red-500 
                        hover: focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" 
                        id="options-menu" 
                        aria-haspopup="true" 
                        aria-expanded="true" 
                        onClick={() => setIsOpen(!isOpen)}>
                    EasyReqSQL
                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5 5a1 1 0 011.707-.707l4.586 4.586a1 1 0 010 1.414l-4.586 4.586A1 1 0 015 14V5z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            {isOpen && (
                <div className="origin-bottom-right absolute right-0 bottom-full w-50 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <button onClick={() => apiReq.deleteApi.deleteUsersAll()} className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 hover:text-red-900" role="menuitem">DELETE ALL USERS</button>
                    </div>
                </div>
            )}
        </div>
    );
}




function toggleAuthRequired() {
  if (turnOffAuth)
  {
    setLogged(false);
    setTurnOffAuth(false);
  }
  else
  {
    setLogged(true);
    setTurnOffAuth(true);
  }
}

	function SubNav() {

		return (
			<>
				{/* <Link href="/home">HOME</Link> */}
				{/* <Link href="/chat">CHAT v2</Link> */}
				{/* <Link href="/proto/chat">CHATROOM</Link> */}
				{/* <Link href={`/profile/${userContext?.login}`}>PROFILE</Link> */}
				{/* <Link href="/auth">AUTH</Link> */}
        {/* <Dropdown/> */}
				{infoUser}
				{/* <button onClick={() => {setLogged(false);localStorage.removeItem("login");}}> DISCONNECT </button> */}
			</>
		)
	}
  
  
	function SubNavNotLog() {
    
    return (
			<>
				{/* <Link href="/">HOME</Link> */}
				{/* <Link href="/auth">AUTH LOGIN</Link> */}
      <Dropdown/>
        {/* <button onClick={toggleAuthRequired} >{turnOffAuth ? <>ON</> : <>OFF</>}</button> */}
				{/* <Link href="/login">OLD LOGIN</Link> */}
				<div className=' text-red-500'>user:(not logged)</div>
			</>
		)
	}

	
	return (
		<>
    <div 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
        >
			{!isHovered ? (
					<div className='absolute bottom-0 left-[48vw] w-auto rounded-t-xl  px-2 bg-slate-800 opacity-40'>
						<div className="h-10 flex justify-center items-center space-x-10">
							<button onClick={() => setIsHovered(false)} className=' text-white'> devbar </button>
						</div>
					</div>
			) : (
				<div className={className}>
					<div className=" text-white h-10 flex justify-center items-center space-x-10">
						<div className=" text-red-600 absolute left-5">Navbar Dev </div>
						{logged ? <SubNav /> : 
            // <SubNavNotLog />
            <SubNav />
            }
						<button onClick={() => setIsHovered(false)}> ❌ </button>
					</div>
				</div>
			)}
      </div>
		</>
	);
}