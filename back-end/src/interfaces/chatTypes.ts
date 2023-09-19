export interface IChatMessage {
	clientId: number;
	clientSocketId?: string;
	clientPsedo: string;
	message: string;
}