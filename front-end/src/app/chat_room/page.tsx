import ChatRoomCommponent from '@/components/chat/ChatRoomComponent'
import React from 'react'

export default function ChatRoom() {
	return (
		<>
			<div>ChatRoom</div>
			<ChatRoomCommponent className='' classNameBlockMessage='m-6 overflow-auto h-[350px]'/>
		</>
	)
}
