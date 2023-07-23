export enum EStatus {
	Offline,
	Online,
	InGame,
}

export interface IUser { //utiliser plutot PODSQL.User
	id_user?: number;
	login?: string;
	nickname?: string;
	password: string;
	avatar_path: string;
	status: number;
	token_2fa: string;
	has_2fa: boolean;
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


export interface User {
  id_user?: number;
  login: string;
  nickname?: string;
  password?: string;
  avatar_path?: string;
  status: number;
  token_2fa?: string;
  has_2fa: boolean;
}

export interface Channel {
  Id_CHANNEL?: number;
  type: number;
  password?: string;
  name: string;
  id_user: number;
}

export interface Message {
  Id_CHANNEL: number;
  id_user: number;
  Id_Message?: number;
  date_msg: Date;
  content: string;
}

export interface Banned {
  Id_CHANNEL: number;
  id_user: number;
  Id_BANNED?: number;
}

export interface ChannelInvite {
  Id_CHANNEL: number;
  id_user: number;
  Id_INVITATION?: number;
}

export interface Mute {
  Id_CHANNEL: number;
  id_user: number;
  Id_MUTE?: number;
}

export interface Game {
  Id_GAME?: number;
  P1_score?: number;
  P2_score?: number;
  game_type: number;
  start_date?: Date;
}

export interface Matchmaking {
  Id_MATCHMAKING?: number;
  id_user: number;
}

export interface Challenge {
  id_user: number;
  Id_USERS_1: number;
  Id_CHALLENGE?: number;
  accepted: boolean;
}

export interface Follow {
  id_user: number;
  Id_USERS_1: number;
}

export interface Subscribe {
  id_user: number;
  Id_USERS_1: number;
}

export interface Block {
  id_user: number;
  Id_USERS_1: number;
}

export interface Joined {
  id_user: number;
  Id_CHANNEL: number;
}

export interface Administrate {
  id_user: number;
  Id_CHANNEL: number;
}

export interface Play {
  id_user: number;
  Id_GAME: number;
}