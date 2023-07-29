"use client";
import {useState, useEffect, useRef, useContext} from "react";
import {useRouter} from "next/navigation";
import io, {Socket} from "socket.io-client";
import {v4 as uuidv4} from "uuid";
import * as POD from "../../shared/types";

import {
	OriginContext,
	UserContext,
	LoggedContext,
	SocketContextChat,
} from "@/context/globalContext";
import Image from "next/image";

const max_msg_lenght: number = 512;


export default function WebsocketClient({	className,	classNameBlockMessage,}: {	className: string;	classNameBlockMessage: string;}) {
  const origin = useContext(OriginContext);
	const apiOrigin = useContext(OriginContext).apiDOM;
	const {userContext} = useContext(UserContext);
	const {logged} = useContext(LoggedContext);
  
	const [message, setMessage] = useState<string>("");
	const [messages, setMessages] = useState<string[]>([]);
	const [infoMessages, setInfoMessages] = useState<string>("");

	const [username, setUsername] = useState("");
	// const [chatMsg, setChatMsg] = useState<POD.IChatMessage>();
	const [chatMsgs, setChatMsgs] = useState<POD.IChatMessage[]>([]);

	// const [channels, setchannels] = useState<string[]>([]);
	// const [currentChannel, setCurrentChannel] = useState<string>("");
  
	const socketRef = useContext(SocketContextChat); // ref sur le websocket global
	const messagesEndRef = useRef<any>(null); //ref sur balise toujours apres dernier message/ pour le scroll auto
  
	const socketChat = useContext(SocketContextChat);

	const router = useRouter();
  
  console.log('Hello CHat Component')

  useEffect(() => {
    console.log('CLIENT: All message demandé')
    if (socketRef && typeof socketRef !== "string") {
      socketRef?.emit("getAllMsgs");
      setMessage("");
    }
  }, [])

	if (!logged) router.push("/login");


	const connectToWebsocket = () => {
		console.log("DBG ORIGIN CONTEXT:" + apiOrigin);
		// Check if socket is defined
		if (socketRef && typeof socketRef !== "string") {

      
			(socketRef as Socket).on("connect", () => {
				console.log("Connected to WebSocket server");
			});
			(socketRef as Socket).on("message", (message: string) => {
				console.log("Received message:", message);
			});
			(socketRef as Socket).on("welcome", (message: string) => {
				setInfoMessages(message);
			});
			(socketRef as Socket).on(
				"getallmsgObj",
				(messages: POD.IChatMessage[]) => {
					setChatMsgs(messages);
				}
			);
			(socketRef as Socket).on("response", (message: string) => {
				console.log("Message confirmé recu:", message);
				setMessages((prevMessages) => [...prevMessages, message]);
			});
			(socketRef as Socket).on("responseObj", (obj: POD.IChatMessage) => {
				console.log(
					"MessageObj confirmé recu:",
					obj.message + " de " + obj.user.nickname
				);
				setChatMsgs((prevChatMsgs) => [...prevChatMsgs, obj]);
			});
		} else {
			console.log("Socket is not defined");
		}
	};


  //at mounted component
useEffect(() => {
  handleConnect();

}, [])

	const handleConnect = () => {
		if (userContext) setUsername(userContext.login);
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
		if (socketRef && typeof socketRef !== "string") {
			let messObj: POD.IChatMessage = {
				user: {
					login: userContext?.login,
					nickname: userContext?.login,
					avatar_path: "string",
					status: 1,
					token_2fa: "string",
					has_2fa: false,
				},
				// clientId: userContext?.id_user,
				// clientPsedo: userContext.login,
				message: msg, 
			};
			console.log("DBG DEBUUUUUG => " + messObj.message);
			socketRef?.emit("message", messObj.message);
			socketRef?.emit("messageObj", messObj);
			setMessage("");
		} else {
			console.error("Tried to send a message before socket is connected");
		}
	};

	useEffect(() => {
    console.log('recu: ' + chatMsgs)
		messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
	}, [chatMsgs]);

	// useEffect(() => {
	//   if (logged)
	//     handleConnect();
	// }, [logged])

	// handleConnect(); 

	return (
		<div className={className}>
			<div>
				<div className="flex justify-center text-sm text-neutral-300 pt-4">
					{infoMessages}
				</div>
				<ul className={classNameBlockMessage}>
					{chatMsgs.map((obj, index) => (
						<div
							key={"blocMessage-" + uuidv4()}
							className={
								obj.user.nickname === username ? "text-right" : "text-left "}>
							<li 
								className={` text-neutral-400 font-semibold text-base ml-4 ${
									obj.user.nickname === username
										? "text-right ml-auto mr-5"
										: "text-left ml-2"}`}	>
								{obj.user.nickname}
							</li>
							<li
								className={`text-white p-2 mb-4 rounded-xl max-w-max min-w-[10rem] 
															${
																obj.user.nickname === username
																	? "text-right ml-auto mr-4 bg-teal-900"
																	: "text-left ml-2 bg-gray-800"}`}>
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
							{/* <img
								src="/chat/send.svg"
								alt="Send"
								className="max-w-[2rem] min-w-[1rem]"
							/> */}
              <Image src="/chat/send.svg" alt="Send button" className="max-w-[2rem] min-w-[1rem]" width={32} height={32}/>
						</button>
					</div>
				</div>
			</>
		</div>
	);
}
