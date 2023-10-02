import { IoAdapter } from '@nestjs/platform-socket.io';
import {OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway} from '@nestjs/websockets';
@WebSocketGateway({
	cors: true,
})
export class WebsocketGatewayGlobal{ } //TODO: Importer le tchek jwt a la connection ici une seul fois ? (plutot que en double dans ws chat et game)
