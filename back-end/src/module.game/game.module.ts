import {forwardRef, Module} from '@nestjs/common';
import {GameController} from './game.controller';
import {GameService} from './game.service';
import {WebsocketGatewayGame} from './game.ws';
import {ServerGame} from './server/ServerGame';
import {UsersModule} from "../module.users/users.module";

@Module({
	controllers: [GameController],
	providers: [
		GameService,
		WebsocketGatewayGame,
		ServerGame,
	],
	imports: [forwardRef(() => UsersModule)]
})
export class GameModule {
}
