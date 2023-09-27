'use client'

import React from 'react'
import ChatMessage from './elements/ChatMessageListElement'
import { v4 as uuidv4 } from "uuid";
import { IChannelMessage } from '@/shared/typesChannel';


export default function ChatMessagesList({className, messages}: {className: string, messages: IChannelMessage[]}) {



  return (
    <div className={`${className}`}>
      {/* <div className="flex-1 overflow-y-auto pt-4 "> */}
        {messages.map((obj, index) => (
          <>
          {obj.ownerUser.UserID > 0 ? 
          <div key={'blocMessage-' + uuidv4()} className='chat_message_list_block'>
            <li className={`chat_message_list_nickname ${obj.ownerUser.UserID === 2 ? 
                            'chat_message_list_nickname_right' : 'chat_message_list_nickname_left'}`}>
              {obj.ownerUser.nickname} ({obj.ownerUser.login})
            </li>
            <li className={`chat_message_list_content ${obj.ownerUser.UserID === 2 ?
                            'chat_message_list_content_right' : 'chat_message_list_content_left'}`}>
              {obj.content}
            </li>
            
          </div>
            :
            <div className='chat_message_list_content_system'>
              Message system
            </div>
          }
                              </>
        ))
        }
        
        {/* <div ref={} /> */}
      {/* </div> */}
    </div>
  )
}

    // <div>
    //   <ChatMessage className={' h-20 items-end justify-center'}/>
    // </div>