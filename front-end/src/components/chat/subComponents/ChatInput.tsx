'use client'

import { IUser } from '@/shared/types';
import Image from 'next/image';
import React, { useState } from 'react'
import { Socket } from 'socket.io';
import { SocketOptions } from 'socket.io-client';
const max_msg_lenght: number = 128;


//TODO: recup userContext pour envoi message + props channel ID 

export default function ChatInput({className, socketRef, user}: {className: string, socketRef: Socket, user: IUser}) {
	const [message, setMessage] = useState<string>("");

  const sendMessageObj = (msg: string) => {
		if (msg.trim().length === 0) return;
		else if (msg.length >= max_msg_lenght) {
			alert("Votre message doit faire moins de 512 caractères ;)");
			setMessage("");
			return;
		}
		if (socketRef && typeof socketRef !== "string") {
      let messObj: POD.IChatMessage = {
        user: {
          UserID: user.UserID,
          login: user.login,
					nickname: user.nickname,
				},
				message: msg, 
			};
			console.log("DBG DEBUUUUUG => " + messObj.message);
			socketRef?.emit("message", messObj.message);
			socketRef?.emit("messageObj", messObj);
			setMessage("");
		} else {
      console.error("Tried to send a message before socket is connected");
		}
	};

  // let message: string = '';
  return (
    <div className={`${className}`}>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
