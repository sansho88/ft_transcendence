'use client'
import Game from './game'

export default function GamePage() {
  return (
    <div className='flex flex-col h-screen w-screen justify-center items-center'>
      {/* <div>GamePage</div> */}
      <Game className='game-scoreboard' /> 
    </div> 
  )
}
