import { UserStatus } from "src/entities/user.entity";
import {IsBoolean, IsEnum, IsOptional, IsString, Length} from "class-validator";

export class UpdateUserDto {
	@IsString()
	@IsOptional()
	@Length(0, 12)
	nickname?: string;

	@IsBoolean()
	@IsOptional()
	has_2fa?: boolean;

	@IsEnum(UserStatus)
	status: UserStatus;
}
