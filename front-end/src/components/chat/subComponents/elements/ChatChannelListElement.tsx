'use client'

import React from 'react'
import { v4 as uuidv4 } from "uuid";


export default function ChatChannelListElement({channelID, channelName, f}: {channelID: number, channelName: string, f: Function}) {

  return (
    <button key={`button_channel_${uuidv4()}`} 
    className='chat_channel_list_element' onClick={() => f(channelID)}> {channelName}</button>
  )
}
