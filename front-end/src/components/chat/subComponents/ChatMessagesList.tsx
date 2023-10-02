'use client'

import React, {useRef, useEffect, useState} from 'react'
import ChatMessage from './elements/ChatMessageListElement'
import { v4 as uuidv4 } from "uuid";
import { IChannelMessage } from '@/shared/typesChannel';


export default function ChatMessagesList({className, messages}: {className: string, messages: IChannelMessage[]}) {

  const refDivEndMessage = useRef<HTMLDivElement>(null);
  const refDivParent = useRef<HTMLDivElement>(null);
  const [buttonGoToEnd, setButtonGoToEnd] = useState<boolean>(false);
  const [newMessageNoRead, setNewMessageNoRead] = useState<boolean>(false);


  const goToEndMessage = () => {
    refDivEndMessage.current?.scrollIntoView({behavior: "smooth"});
  }
  useEffect(() => {
    goToEndMessage();
    
  }, []) //TODO: dependence new message


  //afficher une vignnette / bouton pour redescendre au tout dernier messages
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = refDivParent.current?.scrollTop;
      // console.log("Position actuelle du scroll :", scrollPosition);
      if (refDivParent && scrollPosition)
      {
        const maxHeight = refDivParent.current?.scrollHeight - refDivParent.current?.clientHeight;
        if (scrollPosition < (maxHeight - 400))
          setButtonGoToEnd(true)
        else
          setButtonGoToEnd(false)
      }
    };
  
    refDivParent.current?.addEventListener('scroll', handleScroll);
  
    return () => {
      refDivParent.current?.removeEventListener('scroll', handleScroll);
    };
  }, [refDivParent.current]);
  

  useEffect(() => {
    if (refDivParent.current !== null)
    {  const maxHeight = refDivParent.current?.scrollHeight - refDivParent.current?.clientHeight;
      console.log("Position maximale du scroll :", maxHeight);}
  }, [refDivParent.current]);
  
  
  const btnGoToEnd = (message: string, className?: string) => {
    return (
      <button className={`pointer-events-auto z-10 ${className}`} onClick={goToEndMessage}>{message}</button>
    )
  }

  return (
    <div className={`${className} `} >
      <div className={`chat_message_list_sub`} ref={refDivParent} >
        {/* {buttonGoToEnd && btnGoToEnd()} */}
        {messages.map((obj, index) => (
          <div key={'div' + index}>
            {obj.ownerUser.UserID > 0 ?
              <div key={'blocMessage_' + index} className='chat_message_list_block'>
                <li key={'nickname_' + index}
                  className={`chat_message_list_nickname ${obj.ownerUser.UserID === 2 ?
                    'chat_message_list_nickname_right' : 'chat_message_list_nickname_left'}`}>
                  {obj.ownerUser.nickname} ({obj.ownerUser.login})
                </li>
                <li key={'messageContent_' + index}
                  className={`chat_message_list_content ${obj.ownerUser.UserID === 2 ?
                    'chat_message_list_content_right' : 'chat_message_list_content_left'}`}>
                  {obj.content}
                </li>

              </div>
              :
              <div key={'messageSystem-' + index} className='chat_message_list_content_system'>
                {obj.content}
              </div>}
          </div>
        ))
        }
        <div ref={refDivEndMessage} />
      </div>
      {buttonGoToEnd && 
        (newMessageNoRead ?  
            btnGoToEnd(`! NEW MESSAGE !`, `chat_message_list_goToEndButton chat_message_list_goToEndButton_newMessage`)
          : btnGoToEnd(`GOTO END`, `chat_message_list_goToEndButton`))
      }
        
    </div>
  )
}

    // <div>
    //   <ChatMessage className={' h-20 items-end justify-center'}/>
    // </div>