'use client'
import React from 'react'

export default function ChatChannelListElement({channelID, channelName, f}: {channelID: number, channelName: string, f: Function}) {

  return (
    <button className=' h-12 w-full flex justify-center items-center ' onClick={() => f(channelID)}>{channelName}</button>
  )
}
