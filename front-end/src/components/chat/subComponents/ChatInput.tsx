'use client'

import Image from 'next/image';
import React from 'react'

export default function ChatInput({className}) {

  let message: string = '';
  return (
    <div className={className}>
      <div className='flex absolute bottom-2 pl-2'>

        <input
          type="text"
          value={message}
          onChange={(e) => () => { }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') () => { };
          }}
          className="text-zinc-200 bg-neutral-800 rounded-lg h-10 w-[15rem]"
        />
        <button onClick={() => { }} className="ml-2">
          <Image
            src="/chat/send.svg"
            alt="Send button"
            className="max-w-[2rem] min-w-[1rem]"
            width={32}
            height={32}
          />
        </button>
      </div>
    </div>
  )
}
