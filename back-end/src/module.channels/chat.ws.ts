import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { WSAuthGuard } from '../module.auth/auth.guard';
import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../module.auth/indentify.user';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway extends IoAdapter {
	@WebSocketServer()
	server: Server;

	constructor(private messageService: MessageService) {
		super();
	}

	/** This is a test */

	// Todo: Maybe Give Bearer Token to auth when 1st connection then keep userID and client.ID in a map-like structure
	// Or We could also use a 'Auth' event to identify the user post connection
	async handleConnection(client: Socket, @MessageBody() data: string) {
		console.log(`New Connection ${client.id}`);
	}
	async handleDisconnect(client: Socket, @MessageBody() data: string) {
		console.log(`DisConnection ${client.id}`);
	}

	@SubscribeMessage('event')
	@UseGuards(WSAuthGuard)
	handleEvent(
		@MessageBody() data: string,
		@CurrentUser('id', ParseIntPipe) userID: number,
	): string {
		// console.log(`${data}`);
		console.log(`new user -> ${userID}`);
		return 'je suis un test';
	}
	/** * * * * * * * **/
	@SubscribeMessage('message')
	handleMsg(@MessageBody() data: string): string {
		console.log(data);
		return data;
	}
}
