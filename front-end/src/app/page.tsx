'use client';
import Image from 'next/image'
import React,{useContext, useEffect} from "react";
import Button from "../components/CustomButtonComponent"
import Profile from "../components/ProfileComponent"
import Stats from "../components/StatsComponent"
import { preloadFont } from "next/dist/server/app-render/rsc/preloads";
import * as POD from '@/shared/types'
import { UserContext, LoggedContext } from '@/context/globalContext';
import { useRouter } from 'next/navigation';

export default function Home() {
	preloadFont("../../_next/static/media/2aaf0723e720e8b9-s.p.woff2", "font/woff2");
	const { logged, setLogged } = useContext(LoggedContext);
	const {userContext, setUserContext} = useContext(UserContext);
	const router = useRouter();
	
    enum Colors {
        "grey",  
        "green",
        "gold"
    }
    let StatusColor = new Map<number, string>();

    for (let i: number = 0; i < 3; i++) {
        StatusColor.set(i, Colors[i]);
    }


		useEffect(() => {
			if(!logged)
				router.push('/auth')
		}, [logged])
    // const [logged, setLogged] = React.useState(false);
    const [userStatus, setUserStatus] = React.useState(POD.EStatus.Online);

    let userNickName : string = "NickTaMer";


    function handleLogin() {
        setLogged(true);
        console.log("LOGGED BIM!");
    }

    function handleUserStatus() {

        setUserStatus(userStatus === POD.EStatus.InGame ? POD.EStatus.Online : POD.EStatus.InGame);
        console.log(`User Status: ${userStatus}; statusColor ${StatusColor.get(userStatus)}`);
    }

    const Header = () => {
        <head>
            <link rel={"icon"} href={"./favicon.ico"}/>
        </head>
    }

  function login(){
    if (!logged)
      return (
            <button type="button" onClick={handleLogin} className={"button-login"}>
              <span className="text">LOGIN2</span></button>
          /*<Button border={"2px"} color={"#FFFFFF"} image={"linear-gradient(144deg,#AF40FF, #5B42F3 50%,#00DDEB)"} height={"30px"} width={"60px"} radius={"4px"} onClick={handleLogin}>LOGIN</Button>*/
      )
    else
      return hello("Sansho");
  }
  function hello(name: string){

    let msg: string = "";

    if (name.length)
      msg = "dear " + name + " !\n";
    return (
        <div>
            Hello {msg}
        </div>
    )
  }

  if (!logged)
    return (
			<>
				<Header />
				<div className="main-background">
					<div className="welcome">
						<div className="welcome-msg">WELCOME TO</div>
						{/*<div className="width: 788px; height: 130px; left: 0px; top: 24px; position: absolute; justify-content: center; align-items: center; display: inline-flex">*/}
						<div className="welcome-title">PONG POD! {login()}</div>
					</div>
				</div>
			</>
		);
  else
    return (
        <>
            <Header/>
      <main className="main-background">
        {/*  <div className={"sidebar"}>
              <menu className="menu" autoCapitalize={"words"}  title={"Menu"}>
                <li tabIndex={1}> <img src={"/joystick.svg"} alt={"joystick-logo"}/>Game Mode</li>
                <li tabIndex={2}><img src={"/profile.svg"} alt={"profile-logo"}/>Profile</li>
                <li tabIndex={3}><img src={"/friends.svg"} alt={"friends-logo"}/>Friends</li>
              </menu>
          </div>*/}

          <Profile className={"main-user-profile"} avatar={"/tests/avatar.jpg"} login={userContext?.login} nickname={userContext?.nickname}
                   status={POD.EStatus[userStatus]} statusColor={StatusColor.get(userStatus)} isEditable={true}>
              <p style={{paddingBottom: "1vh"}}><Stats level={42} victories={112} defeats={24} rank={1}/></p>
              <Button image={"/history-list.svg"} onClick={handleLogin} alt={"Match History button"}/>
          </Profile>
          <Button className={"friends"} image={"/friends.svg"} onClick={handleLogin} alt={"Friends list"} height={"42px"}/>

        <div className="game">

          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] max-w-fit max-h-fit"
            src="/pong-logo.png"
            alt="Pong Logo"
            width={768}
            height={768}
            priority
            onClick={handleUserStatus}
          />
            <Button className={"game-options"} border={""} color={""} image={"/joystick.svg"} alt={"GameMode options"}  radius={"0"} onClick={handleUserStatus}/>
        </div>


      </main>
        </>

    )

}
