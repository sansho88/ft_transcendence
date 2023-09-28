'use client'

import Image from 'next/image';
import React from 'react'

//TODO: recup userContext pour envoi message + props channel ID 

export default function ChatInput({className}) {

  let message: string = '';
  return (
    <div className={`${className}`}>

        <input
          type="text"
          value={message}
          onChange={(e) => () => { }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') () => { };
          }}
          className="chat_block_messages_input_input"
        />
        <button onClick={() => { }} className="chat_block_messages_input_button">
          <Image
            src="/chat/send.svg"
            alt="Send button"
            width={32}
            height={32}
          />
        </button>
    </div>
    )
}
