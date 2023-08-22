export class ReceiveMessageDto {
	ownerID: number;
	channelID: number;
	content: string;
}

export class SendMessageDto {
	channelID: number;
	content: string;
}
