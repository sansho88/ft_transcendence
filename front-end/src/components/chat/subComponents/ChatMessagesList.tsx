'use client'

import React from 'react'
import ChatMessage from './elements/ChatMessageListElement'

export default function ChatMessagesList() {
  return (
    <div>
      <ChatMessage className={' h-20 items-end justify-center'}/>
      <ChatMessage className={' h-20 items-end justify-center'}/>
      <ChatMessage className={' h-20 items-end justify-center'}/>
      <ChatMessage className={' h-20 items-end justify-center'}/>
      <ChatMessage className={' h-20 items-end justify-center'}/>
      <ChatMessage className={' h-20 items-end justify-center'}/>
    </div>
  )
}
