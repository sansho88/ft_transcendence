'use client';
import Image from 'next/image'
import * as React from "react";
import Button from "./components/CustomButtonComponent"
import Profile from "./components/ProfileComponent"

export default function Home() {

    enum AllStatus {
        Offline,
        Online,
        InGame
    }
    enum Colors {
        "grey",
        "green",
        "gold"
    }
    let StatusColor = new Map<number, string>();
    console.log(AllStatus.length);
    for (let i: number = 0; i < 3; i++) {
        StatusColor.set(i, Colors[i]);
    }


    const [isLogged, setLog] = React.useState(false);
    const [userStatus, setUserStatus] = React.useState(AllStatus.Online);

  function handleLogin(){
   setLog(true);
    console.log("LOGGED BIM!");
  }

  function handleUserStatus() {

      setUserStatus(userStatus === AllStatus.InGame? AllStatus.Online: AllStatus.InGame );
      console.log(`User Status: ${userStatus}; statusColor ${StatusColor.get(userStatus)}`);
  }

  const Header = () => {
      <head>
          <link rel={"icon"} href={"./favicon.ico"}/>
          <link rel="preload" as="font" href="../../.next/static/media/2aaf0723e720e8b9-s.p.woff2"  type="font/woff2" crossOrigin/>
      </head>
  }

  function login(){
    if (!isLogged)
      return (
            <button type="button" onClick={handleLogin} className={"button-login"}>
              <span className="text">LOGIN</span></button>
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

  if (!isLogged)
    return (
        <>
            <Header/>
        <div className="main-background">
          <div className="welcome">
            <div className="welcome-msg">WELCOME TO</div>
            {/*<div className="width: 788px; height: 130px; left: 0px; top: 24px; position: absolute; justify-content: center; align-items: center; display: inline-flex">*/}
              <div className="welcome-title">PONG POD! {login()}</div>

            </div>
        </div>
     </>
    )
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
          {/*todo: Add History Match Button*/}
          {/*todo: quick stats view*/}
          <Profile className={"main-user-profile"} avatar={"/tests/avatar.jpg"} login={"LOGIN"} nickname={"NickTaMer"} status={AllStatus[userStatus]} statusColor={StatusColor.get(userStatus)} stats={""}/>
          <Button className={"friends"} image={"/friends.svg"} onClick={handleLogin} alt={"Friends list"} height={"42px"}/>

        <div className="game">

          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] max-w-fit max-h-fit"
            src="/pong-logo.png"
            alt="Pong Logo"
            width={512}
            height={512}
            priority
            onClick={handleUserStatus}
          />
            <Button className={"game-options"} border={""} color={""} image={"/joystick.svg"} alt={"GameMode options"}  radius={"0"} onClick={handleUserStatus}/>
        </div>


      </main>
        </>

    )

}
