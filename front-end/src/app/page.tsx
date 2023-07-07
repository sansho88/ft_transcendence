'use client';
import Image from 'next/image'
import * as React from "react";
import Button from "./components/CustomButtonComponent"
import Profile from "./components/ProfileComponent"

export default function Home() {

  const [isLogged, setLog] = React.useState(false);

  function handleLogin(){
   setLog(true);
    console.log("LOGGED BIM!");
  }

  const Header = () => {
      <header>
          <link rel={"icon"} href={"./favicon.ico"}/>
      </header>
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
          {/*//todo Status: Border Color modified with useState + enum (0: offline, 1: online, 2: inGame)*/}
          {/*todo: Add History Match Button*/}
          {/*todo: quick stats view*/}
          <Profile className={"main-user-profile"} avatar={"/tests/avatar.jpg"} login={"LOGIN"} nickname={"NickTaMer"} status={"OnLine"} stats={""}/>
          <Button className={"friends"} image={"/friends.svg"} onClick={handleLogin} alt={"Friends list"} height={"42px"}/>

        <div className="game">

          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] max-w-fit max-h-fit"
            src="/pong-logo.png"
            alt="Pong Logo"
            width={512}
            height={512}
            priority
          />
            <Button className={"game-options"} border={""} color={""} image={"/joystick.svg"} alt={"GameMode options"}  radius={"0"} onClick={handleLogin}/>
        </div>


      </main>
        </>

    )

}
