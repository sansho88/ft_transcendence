'use client'
import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import io, { Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import * as POD from "../../shared/types";

import { OriginContext, UserContext, LoggedContext } from "@/context/globalContext";


const max_msg_lenght: number = 512;


export default function WebsocketClient({className, classNameBlockMessage}: {className: string, classNameBlockMessage: string}) {
	const origin = useContext(OriginContext);
	const apiOrigin = useContext(OriginContext).apiDOM;
	const {userContext} = useContext(UserContext);
	const {logged} = useContext(LoggedContext);


	const [message, setMessage] = useState<string>("");
	const [messages, setMessages] = useState<string[]>([]);
	const [infoMessages, setInfoMessages] = useState<string>("");

	const [username, setUsername] = useState("");
	const [chatMsg, setChatMsg] = useState<POD.IChatMessage>();
	const [chatMsgs, setChatMsgs] = useState<POD.IChatMessage[]>([]);
	
	const [channels, setchannels] = useState<string[]>([]);
	const [currentChannel, setCurrentChannel] = useState<string>('');

	const socketRef = useRef<Socket | null>(null);
	const messagesEndRef = useRef<any>(null);


	const router = useRouter();

		if(!logged)
			router.push('/login');

	const connectToWebsocket = () => {
		console.log('DBG ORIGIN CONTEXT:' + apiOrigin);
		if (socketRef.current)
			return;
		else
		{
			socketRef.current = io(`${apiOrigin}`, {
				query: {
					login: username,
				},
			});
		}

		if (socketRef.current) {
			socketRef.current.on("connect", () => {
				console.log("Connected to WebSocket server");
			});
			socketRef.current.on("message", (message: string) => {
				console.log("Received message:", message);
			});
			socketRef.current.on("welcome", (message: string) => {
				setInfoMessages(message);
				// console.log("Received message:", messages);
			});
			socketRef.current.on("getallmsgObj", (messages: POD.IChatMessage[]) => {
				setChatMsgs(messages);
				// console.log("Received message:", messages);
			});
			socketRef.current.on("response", (message: string) => {
				console.log("Message confirmé recu:", message);
				setMessages((prevMessages) => [...prevMessages, message]);
			});
			socketRef.current.on("responseObj", (obj: POD.IChatMessage) => {
				console.log(
					"MessageObj confirmé recu:",
					obj.message + " de " + obj.clientPsedo
				);
				setChatMsgs((prevChatMsgs) => [...prevChatMsgs, obj]);
			});
		}
	};

	const handleConnect = () => {
		// if (username.trim().length === 0) {
		// 	alert("Username ne doit pas être vide ou ne contenir que des espaces");
		// 	return;
		// }
		if (userContext)
			setUsername(userContext.login);
		connectToWebsocket();
	};

	const sendMessageObj = (msg: string) => {
		// if (username.trim().length === 0) {
		// 	alert("Username ne doit pas être vide ou ne contenir que des espaces");
		// 	return;
		// }
		if (msg.trim().length === 0) return;
		else if (msg.length >= max_msg_lenght) {
			alert("Votre message doit faire moins de 512 caractères ;)");
			setMessage("");
			return;
		}
		if (socketRef.current) {
			let messObj: POD.IChatMessage = {
				clientId: userContext?.id_user,
				clientPsedo: userContext.login,
				message: msg,
			};
			console.log("DBG DEBUUUUUG => " + messObj.message);
			socketRef.current.emit("message", messObj.message);
			socketRef.current.emit("messageObj", messObj);
			setMessage("");
		} else {
			console.error("Tried to send a message before socket is connected");
		}
	};

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
	}, [chatMsgs]);

	return (
		<div className={className}>
			<div>
				<div className="flex justify-center text-sm text-neutral-300 pt-4">
					{infoMessages}
				</div>
				<ul className={classNameBlockMessage}>

					{chatMsgs.map((obj, index) => (
						<div key={"blocMessage-" + uuidv4()} className={obj.clientPsedo === username ? 'text-right' : 'text-left '}>
							<li className={`text-neutral-400 font-semibold text-base ml-4 ${obj.clientPsedo === username ? 'text-right ml-auto mr-5' : 'text-left ml-2'}`}>
								{obj.clientPsedo}
							</li>
							<li className={`p-2 mb-4 rounded-xl max-w-max min-w-[10rem] 
															${obj.clientPsedo === username ? 'text-right ml-auto mr-4 bg-teal-900' : 'text-left ml-2 bg-gray-800'}`}>
								{obj.message}
							</li>
						</div>
					))}
					<div ref={messagesEndRef} />
				</ul>
			</div>
			<>
				<div className="bg-slate-900 m-10 p-5">
					{/* <p className="text-neutral-500">username :</p> */}
					<div className="flex items-center max-w-max">
						{/* <input
							type="text"
							value={username}
							onChange={(b) => setUsername(b.target.value)}
							className=" bg-neutral-800 text-red-500 flex-grow rounded-lg h-8 p-4"
						/> */}
						<button onClick={() => handleConnect()} className="ml-5">
							Connect
						</button>
					</div>

					<br />
					<br />
					{/* bloc button envoi de message */}
					<p className="text-neutral-500">message :</p>
					<div className="flex items-center max-w-max">
						<input
							type="text"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") sendMessageObj(message);
							}}
							className="text-zinc-200 bg-neutral-800 flex-grow rounded-lg h-8 p-4"
						/>
						<button onClick={() => sendMessageObj(message)} className=" ml-5">
							<img
								src="/chat/send.svg"
								alt="Send"
								className="max-w-[2rem] min-w-[1rem]"
							/>
						</button>
					</div>
				</div>
			</>
		</div>
	);
}
