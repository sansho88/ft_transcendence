'use client'

import React from 'react'
import ChatMessage from './elements/ChatMessageListElement'
import { v4 as uuidv4 } from "uuid";
import { IChannelMessage } from '@/shared/typesChannel';


export default function ChatMessagesList({className, messages}: {className: string, messages: IChannelMessage[]}) {



  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex-1 overflow-y-auto text-sm text-neutral-300 pt-4">
        {messages.map((obj, index) => (
        <div
          key={'blocMessage-' + uuidv4()}>
          </div>
        ))}
        <div ref={} />
      </div>
    </div>
  )
}

    // <div>
    //   <ChatMessage className={' h-20 items-end justify-center'}/>
    // </div>