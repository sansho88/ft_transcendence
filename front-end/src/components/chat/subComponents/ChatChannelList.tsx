'use client'

import React from 'react'
import ChatChannelListElement from './elements/ChatChannelListElement'

export default function ChatChannelList({className, setChannel}: {className: string, setChannel: Function}) {

  const createChannel = () => {
    return (

        <button onClick={() => console.log('ADD CHANNEL')}>
          ADD
        </button>
    )
  }
  return (
    <div className={className}> 
      <ChatChannelListElement channelID={1} channelName='#Channel 1' f={setChannel}/>
      <ChatChannelListElement channelID={2} channelName='#Channel 2' f={setChannel}/>
      <ChatChannelListElement channelID={3} channelName='#Channel 3' f={setChannel}/>
      <ChatChannelListElement channelID={4} channelName='#Channel 4' f={setChannel}/>
      <ChatChannelListElement channelID={5} channelName='#Channel 5' f={setChannel}/>
      <ChatChannelListElement channelID={6} channelName='#Channel 6' f={setChannel}/>
      <ChatChannelListElement channelID={7} channelName='#Channel 7' f={setChannel}/>
      <ChatChannelListElement channelID={8} channelName='#Channel 8' f={setChannel}/>
      <ChatChannelListElement channelID={9} channelName='#Channel 9' f={setChannel}/>
      <ChatChannelListElement channelID={10} channelName='#Channel 10' f={setChannel}/>
      <ChatChannelListElement channelID={11} channelName='#Channel 11' f={setChannel}/>
      <div className='flex relative justify-center items-center'>
        {createChannel()}
      </div>

    </div>
  )
}
