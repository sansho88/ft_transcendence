import {BadRequestException, forwardRef, Inject, Injectable} from '@nestjs/common';
import {UpdateUserDto} from '../dto/user/update-user.dto';
import {UserEntity, UserStatus} from '../entities/user.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserCredentialEntity} from '../entities/credential.entity';
import * as fs from 'fs-extra'; // pour gerer les fichiers a l'intérieur du back (fs = file system)
import Jimp from 'jimp';
import {ChatGateway} from "../module.channels/chat.ws";
import {ChannelService} from "../module.channels/channel.service";

const acceptedImageTypes = [
	'jpeg',
	'png',
	'gif',
	'bmp',
	'tiff',
	'gif'
];

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private usersRepository: Repository<UserEntity>,
		@Inject(forwardRef(() => ChatGateway))
		private chatGateway: ChatGateway,
		@Inject(forwardRef(() => ChannelService))
		private channelService: ChannelService
	) {
	}

	/**
	 * Todo: update with new thing in table
	 */
	/**
	 * Create and save the new user
	 * @param newLogin login of the user
	 * @param newInvite if true the person is treated not has a member of 42
	 * @param newCredential his credential
	 */
	async create(
		newLogin: string,
		newInvite: boolean,
		newCredential: UserCredentialEntity,
	) {
		let nickname: string;
		nickname = newLogin;
		if (newInvite)
			nickname = this.generateNickname();
		while (await this.nicknameUsed(nickname))
			nickname = this.generateNickname();
		const globalChannel = await this.channelService.getGlobalChannel();
		const user = this.usersRepository.create({
			login: newLogin,
			nickname: nickname,
			visit: newInvite,
			channelJoined: [globalChannel],
		});
		user.credential = newCredential;
		await user.save();
		console.log(`New User \`${user.login}\` with ID ${user.UserID}`);
		return user;
	}

	async findAll() {
		return this.usersRepository.find();
	}

	/**
	 * @return UserEntity Or Undefined if user not in db
	 */
	async findOne(userID: number, relations?: string[]) {
		let user: UserEntity;
		if (!relations)
			user = await this.usersRepository.findOneBy({UserID: userID});
		else
			user = await this.usersRepository.findOne({
				where: {UserID: userID},
				relations,
			});
		if (user == null) throw new BadRequestException("this user doesn't exist");
		return user;
	}

	async update(user: UserEntity, updateUser: UpdateUserDto) {
		if (!await this.nicknameUsed(updateUser.nickname)) user.nickname = updateUser.nickname
		if (updateUser.avatar_path !== undefined) user.avatar_path = updateUser.avatar_path;
		if (updateUser.has_2fa !== undefined) user.has_2fa = updateUser.has_2fa;
		await user.save();
		await this.chatGateway.updateUserStatusEmit(user);
		return user;
	}

	async uploadAvatar(user: UserEntity, file, request) {
		try {
			const internalPath = request.protocol + '://' + request.hostname + ':' + process.env.PORT_SERVER;
			console.log("internalPath: ", internalPath);
			const buffer = file.buffer;
			const img = await Jimp.read(buffer)
				.then((my_img) => {
					return my_img.getExtension();
				})
				.catch((err) => {
					console.error(err);
				});

			if (!img || !acceptedImageTypes.includes(`${img}`)) {
				throw new BadRequestException('Le fichier doit avoir une extension .png, .jpg, .jpeg ou .gif');
			}
			const fileName = `${Date.now()}.${crypto.randomUUID()}.${img}`;
			const uploadPath = `${process.cwd()}/public/avatars/${fileName}`;

			await fs.ensureDir(`${process.cwd()}/public/avatars`);
			await fs.outputFile(uploadPath, await Jimp.read(buffer).then((my_img) => {
				const width = my_img.getWidth();
				const height = my_img.getHeight();

				const squareSize = 1000;

				if (width < squareSize || height < squareSize) {
					my_img.resize(squareSize, squareSize, Jimp.RESIZE_NEAREST_NEIGHBOR);
					return my_img
						.quality(99)
						.getBufferAsync(Jimp.MIME_JPEG);
				}

				let cropped: any
				const minSize = Math.min(width, height)
				const maxSize = Math.max(width, height)
				const diff = maxSize - minSize

				if (width > height) {
					cropped = my_img.crop(diff / 4, 0, minSize, minSize).resize(squareSize, squareSize, Jimp.RESIZE_BILINEAR)
				} else {
					cropped = my_img.crop(0, diff / 4, minSize, minSize).resize(squareSize, squareSize, Jimp.RESIZE_BILINEAR)
				}
				return my_img
					.quality(90)
					.getBufferAsync(Jimp.MIME_JPEG);
			}));

			if (user.avatar_path?.includes(internalPath) ?? false) {
				let oldAvatarPath = `${process.cwd()}${user.avatar_path.substring(internalPath.length)}`;
				oldAvatarPath = oldAvatarPath.trim();
				await fs.remove(oldAvatarPath);
			}

			user.avatar_path = internalPath + '/public/avatars/' + fileName;
			user.save();
			console.log("NEW user.avatar_path: ", user.avatar_path);
			return user.avatar_path;
		} catch (error) {
			console.log("error: ", error);
			throw new BadRequestException(error.message);
		}
	}


	async getCredential(userID: number) {
		const target = await this.usersRepository.findOne({
			where: {UserID: userID},
			relations: ['credential'],
		});
		return target.credential;
	}

	/**
	 * Need to call a emit to notify other User (Followers) that they change status on 'user.${user.userID}`
	 */
	async userStatus(user: UserEntity, newStatus: UserStatus) {
		user.status = newStatus;
		await user.save();
		await this.chatGateway.updateUserStatusEmit(user);
	}

	private generateNickname() {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		let counter = 0;
		while (counter < 12) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
			counter += 1;
		}
		return result;
	}

	/**
	 * return false if nickname is not used
	 */
	async nicknameUsed(nickname: string) {
		return !!await this.usersRepository.findOneBy({nickname: nickname});
	}

	blockUser(user: UserEntity, target: UserEntity) {
		user.blocked.push(target);
		return user.save();
	}

	unBlockUser(user: UserEntity, target: UserEntity) {
		user.blocked = user.blocked.filter(block => block.UserID != target.UserID);
		return user.save();
	}

	async getAdminUser() {
		return this.usersRepository.findOneBy({
			login: 'PongGod'
		});
	}
}
