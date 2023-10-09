'use client'

import React, {useRef, useEffect, useState} from 'react'
import ChatMessage from './elements/ChatMessageListElement'
import { v4 as uuidv4 } from "uuid";
import { IChannelMessage } from '@/shared/typesChannel';
import { IChannelEntity } from '@/shared/entities/IChannel.entity';
import { IMessageEntity } from '@/shared/entities/IMessage.entity';
import { messageDTO } from '@/shared/DTO/InterfaceDTO'


export default function ChatMessagesList({className, messages, currentChannel, userCurrentID}
  : {className: string, messages: messageDTO.IReceivedMessageEventDTO[], currentChannel: number, userCurrentID: number}) {

  const refDivEndMessage = useRef<HTMLDivElement>(null);
  const refDivParent = useRef<HTMLDivElement>(null);
  const [buttonGoToEnd, setButtonGoToEnd] = useState<boolean>(false);
  const [newMessageNoRead, setNewMessageNoRead] = useState<boolean>(false);


  const goToEndMessage = (typeScroll: "auto" | "smooth") => {
    refDivEndMessage.current?.scrollIntoView({behavior: typeScroll});
  }
  useEffect(() => {
    setTimeout(() => {
      goToEndMessage('auto');
    }, 100)
    
    
  }, []) //TODO: dependence new message... OU PAS ?

  useEffect(() => {

    setTimeout(() => {
      goToEndMessage('auto');
    }, 100)
    
  }, [currentChannel])


//si nouveau message check la position de la scrollbar, va en bas si proche du bas sinon ne fait rien
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = refDivParent.current?.scrollTop;
      if (refDivParent && scrollPosition)
      {
        const maxHeight = refDivParent.current?.scrollHeight - refDivParent.current?.clientHeight;
        console.log(`scollPos=${scrollPosition} || maxHeigh=${maxHeight - 50}`)
        if (scrollPosition > (maxHeight - 400))
        {
          setTimeout(() => {
            goToEndMessage('smooth');
          }, 100)
        }
      }
    };
      handleScroll();
  }, [messages]);

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
      <button className={`pointer-events-auto z-10 ${className}`} onClick={() => goToEndMessage('smooth')}>{message}</button>
    )
  }

  return (
    <div className={`${className} `} >
      <div className={`chat_message_list_sub`} ref={refDivParent} >
        {/* {buttonGoToEnd && btnGoToEnd()} */}
        {Array.isArray(messages) &&  messages.map((obj, index) => (
          <div key={'div' + index}>
            {obj.author.UserID > 0 ?
              <div key={'blocMessage_' + index} className='chat_message_list_block'>
                <li key={'nickname_' + index}
                  className={`chat_message_list_nickname ${obj.author.UserID === userCurrentID ?
                    'chat_message_list_nickname_right' : 'chat_message_list_nickname_left'}`}>
                  {obj.author.nickname} ({obj.author.login})
                </li>
                <li key={'messageContent_' + index}
                  className={`chat_message_list_content ${obj.author.UserID === userCurrentID ?
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