'use client'
import React, { useEffect, useState } from 'react'
import { GameTheme } from "@/shared/typesGame";

export default function SwitcherTheme({className, setThemeFunction}) {

  const [isOverlap, setIseOverlap] = useState<boolean>(false);
  const themeLst = new GameTheme();


  return (
    <div className={`${className} `}>
    {!isOverlap ?
      <button onMouseEnter={() => setIseOverlap(true)} className='flex relative opacity-30 rounded-[30%] p-2'>themes</button>
      :
      <div onMouseLeave={() => setIseOverlap(false)} className=' flex space-x-5 p-1 m-1  game'>
        <button onClick={() => {setThemeFunction(themeLst.sunset); localStorage.setItem('theme', themeLst.sunset)}} className=''>SUNSET</button>
        <button onClick={() => {setThemeFunction(themeLst.classicPong); localStorage.setItem('theme', themeLst.classicPong)}} className=''>CLASSIC</button>
        <button onClick={() => {setThemeFunction(themeLst.neon); localStorage.setItem('theme', themeLst.neon)}} className=''>NEON</button>
        
      </div>
    }
    
    </div>
  )
}
 
