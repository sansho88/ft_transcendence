import {IsBoolean, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {EGameMod} from "../shared/typesGame";

export class CreateChallengeDTOPPipe {
	@IsNumber()
	@IsNotEmpty()
	targetID: number

	@IsNumber()
	@IsNotEmpty()
	gameMod: EGameMod;
}

export class ChallengeAcceptedDTO {
	@IsNotEmpty()
	@IsBoolean()
	response: boolean;

	@IsNotEmpty()
	@IsString()
	event: string;
}
