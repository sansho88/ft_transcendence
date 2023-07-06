'use client';
import Image from 'next/image'
import * as React from "react";
import Button from "./components/CustomButtonComponent"

export default function Home() {

  const [isLogged, setLog] = React.useState(false);

  function handleLogin(){
   setLog(true);
    console.log("LOGGED BIM!");
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
        <div className="main-background">
          <div className="welcome">
            <div className="welcome-msg">WELCOME TO</div>
            {/*<div className="width: 788px; height: 130px; left: 0px; top: 24px; position: absolute; justify-content: center; align-items: center; display: inline-flex">*/}
              <div className="welcome-title">PONG POD! {login()}</div>

            </div>

           {/* <div className="width: 276px; height: 74px; left: 244px; top: 216px; position: absolute">
              <div className="width: 276px; height: 74px; left: 0px; top: 0px; position: absolute; background: #07C3FF; border-radius: 8px"></div>

            </div>
            <div className="width: 24px; height: 24px; left: 670px; top: 99px; position: absolute; background: #07C3FF; border-radius: 9999px"></div>*/}
        </div>
    )
  else
    return (
        <>
            <header>
                <link rel="icon" href="/favicon-48x48.cbbd161b.png"/>

            </header>
      <main className="main-background">
          <div className={"sidebar"}>
              <menu className="menu" autoCapitalize={"words"}  title={"Menu"}>
                <li tabIndex={1}> <img src={"/friends.svg"}/>Game Mode</li>
                <li tabIndex={2}><img src={"/friends.svg"}/>Profile</li>
                <li tabIndex={3}><img src={"/friends.svg"}/>Friends</li>
              </menu>
          </div>


        <div className="game">

          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] max-w-fit max-h-fit"
            src="/pong-logo.png"
            alt="Pong Logo"
            width={512}
            height={512}
            priority
          />
        </div>


      </main>
        </>

    )

}
