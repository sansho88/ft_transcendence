import {Controller, Get} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('is-on')
	IsOn() {
		console.log('Is on !');
		return 'The api is on\n';
	}
}
