import io, { Socket } from "socket.io-client";
import { useContext, useState, useRef } from "react";

export default function websocketConnect(apiDomain: string, login: string)
{
	const socket = io(`${apiDomain}`, {
		query: {
			login: login,
		},
	});

	socket.on("connect", () => {
		console.log("Connected to websocket");
	});

	socket.on("disconnect", () => {
		console.log("Disconnected from websocket");
	});

	return socket;
}