import React, {useContext, useEffect, useState} from "react";
import {UserContext} from '@/context/globalContext';
import "../utils/usefulFuncs"
import {Colors, getEnumNameByIndex} from "@/utils/usefulFuncs";

export interface avatarProps {
	path?:string;
	width:string;
	height:string;
	playerStatus:number;
}
const Avatar: React.FC<avatarProps> = ({path, width, height, playerStatus}) => {

	const [statusColor, setStatusColor] = useState(getEnumNameByIndex(Colors, playerStatus));
	const {userContext, setUserContext} = useContext(UserContext);


	useEffect(() => {
		setStatusColor(getEnumNameByIndex(Colors, playerStatus));
	}, [playerStatus]);

	if (userContext.avatar_path == undefined || userContext.avatar_path?.length == 0)
		path = "/tests/avatar.jpg"

	return (
		<img className={"avatar"} src={path} alt="Avatar" style={{
			borderWidth: "2px",
			borderColor: statusColor,
			boxShadow: `1px 2px 5px ${statusColor}`,
			transition: "1000ms",
			borderRadius: "8px",
			width: width,
			height: height,
			display: "inline-block"
		}}/>
	)
}

export default Avatar;