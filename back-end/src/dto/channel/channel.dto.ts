export class CreateChannelDTO {
	name: string;
	password?: string;
	protected: boolean;
}

export class JoinChannelDTO {
	id: number;
	password?: string;
	protected: boolean;
}
