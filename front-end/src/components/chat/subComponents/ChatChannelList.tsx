'use client'

import React from 'react'
import {charChannelListElement} from '@/components/'

export default function ChatChannelList({className}) {
  return (
    <div className={className}> 
      <ChatChannelListElement />
    </div>
  )
}
