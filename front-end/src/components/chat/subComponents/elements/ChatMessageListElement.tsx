'use client'

import React from 'react'
import { v4 as uuidv4 } from "uuid";


/**
 * message detestiné a la liste de message dans le chat component
 * @returns 
 */
export default function ChatMessage({className}) {
  return (
    <div key={`message_${uuidv4()}`} className={className}>
      MESSAGES

    </div>
  )
}
