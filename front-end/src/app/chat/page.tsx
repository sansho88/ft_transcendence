'use client'

import ChatMaster from '@/components/chat/ChatMaster'
import React from 'react'

export default function Chat() {
  return (
      <div className='flex relative  w-full h-full justify-center  '>
        <div className=' pt-40 w-1/3 h-3/4'>

        <ChatMaster className='' token='' />
        </div>
    </div>
  )
}