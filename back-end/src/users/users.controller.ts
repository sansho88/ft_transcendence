import {
	Controller,
	HttpCode,
	Delete,
	Patch,
	Param,
	Body,
	Post,
	Get,
	Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Get()
	findAll() {
		return this.usersService.findAll();
	}

	@Get(':id')
	// @Res(HttpCode)
	// @HttpCode(200)
	findOne(@Param('id') id: string) {
		return User.count().then((id_count) => {
			if (id_count >= parseInt(id) && parseInt(id) > 0)
				return this.usersService.findOne(parseInt(id));
			return User.create({ id_users: -1 });
		});
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(+id, updateUserDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.usersService.remove(+id);
	}
}
