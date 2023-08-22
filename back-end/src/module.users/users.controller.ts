import {
	Controller,
	Delete,
	Param,
	Body,
	Post,
	Get,
	Put,
	UseGuards,
	ParseIntPipe,
	BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { CurrentUser } from '../module.auth/indentify.user';
import { AuthGuard } from '../module.auth/auth.guard';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	create() {
		// return this.usersService.create(createUserDto);
		return 'USE `/module.auth/sign` to create a new user';
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

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.usersService.remove(+id);
	}

	/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ***/

	@Get('me')
	@UseGuards(AuthGuard)
	me(@CurrentUser('id', ParseIntPipe) id: number) {
		return this.usersService.findOne(id);
	}

	@Get('/get')
	@UseGuards(AuthGuard)
	findAll() {
		return this.usersService.findAll();
	}

	@Get('/get/:id')
	@UseGuards(AuthGuard)
	async findOneID(@Param('id', ParseIntPipe) id: number) {
		const user = await this.usersService.findOne(id);
		if (user == null) throw new BadRequestException();
		return user;
	}

	/*************************************************/

	@Put('update')
	@UseGuards(AuthGuard)
	updateNickname(
		@CurrentUser('id', ParseIntPipe) id: number,
		@Body() update: UpdateUserDto,
	) {
		return this.usersService.update(id, update);
	}
}
