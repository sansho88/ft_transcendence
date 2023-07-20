import {
	ApiBody,
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiExcludeEndpoint,
} from '@nestjs/swagger';
import {
	Controller,
	Delete,
	Put,
	Param,
	Body,
	Post,
	Get,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';

@ApiTags('USERS')
@Controller('users')
export class UsersController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@ApiOperation({
		summary: 'Create a new user, renvoi en reponse obj User complet si OK',
	})
	@ApiBody({ type: CreateUserDto })
	@ApiResponse({
		status: 201,
		description: 'User created successfully',
		type: User,
	})
	@ApiResponse({ status: 409, description: 'User already exists' })
	create(@Body() createUserDto: User): Promise<User | undefined> {
		return this.userService.create(createUserDto);
	}

	//TODO: juste pour session avec mdp, a supprimer une fois auth by API42
	// @ApiExcludeEndpoint()
	@Post('login')
	// @ApiTags('LOGIN SYSTEM /DEV ONLY')
	// @ApiExcludeEndpoint()
	@ApiOperation({
		summary:
			"ONLY_DEV temp/ check si combo login/password is OK",
	})
	@ApiBody({ type: LoginUserDto })
	@ApiResponse({ status: 401, description: 'Invalid password' })
	@ApiResponse({ status: 201, description: 'Valid password' })
	comparePassword(
		@Body() loginUserDto: LoginUserDto,
	): Promise<{ success: boolean; message: string }> {
		return this.userService.comparePassword(loginUserDto);
	}

	@Get()
	@ApiOperation({ summary: 'Get all users' })
	@ApiResponse({ status: 200, description: 'All users', type: [User] })
	async findAll() {
		return this.userService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get one user by id' })
	@ApiParam({ name: 'id', type: 'string' })
	async findOneById(@Param('id') id: string): Promise<User | undefined> {
		const user = await this.userService.findOne(parseInt(id));
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user;
	}

	@ApiOperation({ summary: 'Get one user by login' })
	@Get('/login/:login')
	@ApiParam({ name: 'login', type: 'string' })
	@ApiResponse({ status: 200, description: 'User found', type: User })
	@ApiResponse({ status: 404, description: 'User not found' })
	async findOneByUsername(
		@Param('login') login: string,
	): Promise<User | undefined> {
		const user = await this.userService.findByUsername(login);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user;
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update one user by id' })
	@ApiParam({ name: 'id', type: 'string' })
	@ApiBody({ type: UpdateUserDto })
	@ApiResponse({ status: 200, description: 'User updated successfully' })
	@ApiResponse({ status: 404, description: 'User not found' })
	async update(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
	): Promise<User | { message: string }> {
		const user = await this.userService.findOne(parseInt(id));
		if (!user) {
			throw new NotFoundException('User not found');
		}

		const updatedUser = await this.userService.update(
			parseInt(id),
			updateUserDto,
		);
		return { message: 'User updated successfully' };
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete one user by id' })
	@ApiParam({ name: 'id', type: 'string' })
	@ApiResponse({ status: 200, description: 'User removed successfully' })
	@ApiResponse({ status: 404, description: 'User not found' })
	async remove(@Param('id') id: string): Promise<{ message: string }> {
		const user = await this.userService.findOne(parseInt(id));
		if (!user) {
			throw new NotFoundException('User not found');
		}
		const tmp = user.login;
		await this.userService.remove(parseInt(id));
		return { message: `User ${tmp} (id: ${id}) removed successfully` };
	}

	@Delete()
	@ApiOperation({ summary: 'Delete all users' })
	@ApiResponse({ status: 200, description: 'All users removed successfully' })
	async removeAll(): Promise<{ message: string }> {
		await this.userService.removeAll();
		return { message: `All users removed successfully` };
	}
}
