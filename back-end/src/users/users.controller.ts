import {
	Controller,
	Delete,
	Param,
	Body,
	Post,
	Get,
	Put,
	UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { CurrentUser } from '../auth/indentify.user';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	create() {
		// return this.usersService.create(createUserDto);
		return 'USE `/auth/sign` to create a new user';
	}

	// @Get('/get/:login')
	// findOne(@Param('login') login: string, @Param('login') id : number) {
	// 	return this.usersService.findOne(login).then((result) => {
	// 		if (!result) {
	// 			throw new BadRequestException('This Login is not registered');
	// 		}
	// 		return result;
	// 	});
	// }

	// @Put()
	// follow(@Body() updateUser: UpdateUserDto) {
	// 	return this.usersService.update(updateUser.login, updateUser);
	// }

	// @Patch(':login')
	// update(@Param('login') login: string, @Body() updateUserDto: UpdateUserDto) {
	// 	return this.usersService.update(+login, updateUserDto);
	// }

	@Delete(':login')
	remove(@Param('login') login: string) {
		return this.usersService.remove(+login);
	}

	/*************************************************/

	@Get('me')
	@UseGuards(AuthGuard)
	me(@CurrentUser('login') user) {
		return this.usersService.findOne(user);
	}

	@Get('/get/:login')
	@UseGuards(AuthGuard)
	findOne(@Param('login') login: string) {
		return this.usersService.findOne(login);
	}

	@Get('get')
	@UseGuards(AuthGuard)
	findAll() {
		return this.usersService.findAll();
	}

	/*************************************************/

	@Put('update')
	@UseGuards(AuthGuard)
	updateNickname(
		@CurrentUser('login') login: string,
		@Body() update: UpdateUserDto,
	) {
		return this.usersService.update(login, update);
	}
}
