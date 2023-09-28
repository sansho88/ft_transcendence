'use client'

import React from 'react'
import ChatChannelListElement from './elements/ChatChannelListElement'

export default function ChatChannelList({className, setChannel}: {className: string, setChannel: Function}) {

  const addChannel = () => {
    return (

        <button onClick={() => console.log('ADD CHANNEL POPUP')}>
          JOIN
        </button>
    )
  }
  const paramChannel = () => {
    return (

        <button onClick={() => console.log('OPEN PARAM CURRENT CHANNEL POPUP')}>
          PARAM
        </button>
    )
  }
  return (

    <div className={`${className}`}>
      <div className={`chat_channel_list`}>
        <ChatChannelListElement channelID={1} channelName='#Channel 1' f={setChannel} />
        <ChatChannelListElement channelID={2} channelName='#Channel 2' f={setChannel} />
        <ChatChannelListElement channelID={3} channelName='#Channel 3' f={setChannel} />
        <ChatChannelListElement channelID={4} channelName='#Channel 4' f={setChannel} />
        <ChatChannelListElement channelID={5} channelName='#Channel 5' f={setChannel} />
        <ChatChannelListElement channelID={6} channelName='#Channel 6' f={setChannel} />
        <ChatChannelListElement channelID={7} channelName='#Channel 7' f={setChannel} />
        <ChatChannelListElement channelID={8} channelName='#Channel 8' f={setChannel} />
        <ChatChannelListElement channelID={9} channelName='#Channel 9' f={setChannel} />
        <ChatChannelListElement channelID={10} channelName='#Channel 10' f={setChannel} />
        <ChatChannelListElement channelID={11} channelName='#Channel 11' f={setChannel} />
        <ChatChannelListElement channelID={12} channelName='#Channel 12' f={setChannel} />
        <ChatChannelListElement channelID={13} channelName='#Channel 13' f={setChannel} />
        <ChatChannelListElement channelID={14} channelName='#Channel 14' f={setChannel} />
        <ChatChannelListElement channelID={15} channelName='#Channel 15' f={setChannel} />
        <ChatChannelListElement channelID={16} channelName='#Channel 16' f={setChannel} />
        <ChatChannelListElement channelID={17} channelName='#Channel 17' f={setChannel} />
        <ChatChannelListElement channelID={18} channelName='#Channel 18' f={setChannel} />
        <ChatChannelListElement channelID={19} channelName='#Channel 19' f={setChannel} />
        <ChatChannelListElement channelID={20} channelName='#Channel 20' f={setChannel} />
        <ChatChannelListElement channelID={21} channelName='#Channel 21' f={setChannel} />
        <ChatChannelListElement channelID={22} channelName='#Channel 22' f={setChannel} />
        <ChatChannelListElement channelID={23} channelName='#Channel 23' f={setChannel} />
        <ChatChannelListElement channelID={24} channelName='#Channel 24' f={setChannel} />
        <ChatChannelListElement channelID={25} channelName='#Channel 25' f={setChannel} />
        <ChatChannelListElement channelID={26} channelName='#Channel 26' f={setChannel} />
        <ChatChannelListElement channelID={27} channelName='#Channel 27' f={setChannel} />
        <ChatChannelListElement channelID={28} channelName='#Channel 28' f={setChannel} />
        <ChatChannelListElement channelID={29} channelName='#Channel 29' f={setChannel} />
        <ChatChannelListElement channelID={30} channelName='#Channel 30' f={setChannel} />

      </div>
      <div className='chat_channel_buttons'>
        {addChannel()} &nbsp; &nbsp; | &nbsp; &nbsp; {paramChannel()}
      </div>
    </div>
  )
}
