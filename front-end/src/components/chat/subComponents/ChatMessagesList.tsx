'use client'

import React, {useRef, useEffect} from 'react'
import ChatMessage from './elements/ChatMessageListElement'
import { v4 as uuidv4 } from "uuid";
import { IChannelMessage } from '@/shared/typesChannel';


export default function ChatMessagesList({className, messages}: {className: string, messages: IChannelMessage[]}) {

  const refDivParent = useRef<HTMLDivElement>(null);

  useEffect(() => {

    console.log(refDivParent.current?.offsetHeight)
  }, [refDivParent.current?.offsetHeight])


  return (
      <div className={`${className}`} >
        {messages.map((obj, index) => (
          <>
            {obj.ownerUser.UserID > 0 ?
              <div key={'blocMessage-' + uuidv4()} className='chat_message_list_block'>
                <li key={'nickname-' + uuidv4()}
                  className={`chat_message_list_nickname ${obj.ownerUser.UserID === 2 ?
                    'chat_message_list_nickname_right' : 'chat_message_list_nickname_left'}`}>
                  {obj.ownerUser.nickname} ({obj.ownerUser.login})
                </li>
                <li key={'message-' + uuidv4()}
                  className={`chat_message_list_content ${obj.ownerUser.UserID === 2 ?
                    'chat_message_list_content_right' : 'chat_message_list_content_left'}`}>
                  {obj.content}
                </li>

              </div>
              :
              <div key={'messageSystem-' + uuidv4()} className='chat_message_list_content_system'>
                {obj.content}
              </div>
            }
          </>
        ))
        }

        {/* <div ref={} /> */}
      </div>
  )
}

    // <div>
    //   <ChatMessage className={' h-20 items-end justify-center'}/>
    // </div>