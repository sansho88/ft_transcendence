export enum EStatus {
	Offline,
	Online,
	InGame,
}

export enum EStepLogin {
	start,
	enterLogin,
	loginIsEnter,
	enterPassword,
	passwordIsEnter,
	tryLogin,
	successLogin,
	errorLogin,
}

export interface IChatMessage {
	user: IUser;
	message: string;
}

export interface IOriginNetwork {
	domain: string;
	apiPort: number | string;
	appPort: number | string;
	apiDOM?: string;
	appDOM?: string;
}

export interface IInput {
	type: string;
	value: string;
	onKeyDown: any;
	onChange: any;
}



// +---------------------------------------------------------------------+
// |                        SQL TABLE CORRESPONDENCE                     |
// +---------------------------------------------------------------------+


export interface IUser {
  id_user?: number;
  login: string;
  nickname?: string;
  password?: string;
  avatar_path?: string;
  status: number;
  token_2fa?: string;
  has_2fa: boolean;
}

export interface IChannel {
  Id_CHANNEL?: number;
  type: number;
  password?: string;
  name: string;
  id_user: number;
}

export interface IMessage {
  Id_CHANNEL: number;
  id_user: number;
  Id_Message?: number;
  date_msg: Date;
  content: string;
}

export interface IBanned {
  Id_CHANNEL: number;
  id_user: number;
  Id_BANNED?: number;
}

export interface IChannelInvite {
  Id_CHANNEL: number;
  id_user: number;
  Id_INVITATION?: number;
}

export interface IMute {
  Id_CHANNEL: number;
  id_user: number;
  Id_MUTE?: number;
}

export interface IGame {
  Id_GAME?: number;
  P1_score?: number;
  P2_score?: number;
  game_type: number;
  start_date?: Date;
}

export interface IMatchmaking {
  Id_MATCHMAKING?: number;
  id_user: number;
}

export interface IChallenge {
  id_user: number;
  Id_USERS_1: number;
  Id_CHALLENGE?: number;
  accepted: boolean;
}

export interface IFollow {
  id_user: number;
  Id_USERS_1: number;
}

export interface ISubscribe {
  id_user: number;
  Id_USERS_1: number;
}

export interface IBlock {
  id_user: number;
  Id_USERS_1: number;
}

export interface IJoined {
  id_user: number;
  Id_CHANNEL: number;
}

export interface IAdministrate {
  id_user: number;
  Id_CHANNEL: number;
}

export interface IPlay {
  id_user: number;
  Id_GAME: number;
}