'use client'
import React from 'react'

export default function ChatChannelListElement({channelID, channelName, f}: {channelID: number, channelName: string, f: Function}) {

  return (
    <button className='chat_channel_list_element' onClick={() => f(channelID)}>{channelName}</button>
  )
}
