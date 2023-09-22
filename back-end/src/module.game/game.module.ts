import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { WebsocketGatewayGame } from './game.ws';
import { ServerGame } from './server/ServerGame';

@Module({
  controllers: [GameController],
  providers: [GameService, WebsocketGatewayGame, ServerGame]
})
export class GameModule {}
