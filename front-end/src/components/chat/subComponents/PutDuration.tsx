import { IUser } from "@/shared/types";
import Image from "next/image";
import * as apiReq from '@/components/api/ApiReq'
import React, { useState } from "react";
import { inherits } from "util";
import {NotificationManager} from 'react-notifications';


export const DurationType = {
	none: 0,
	Mute: 1,
	Ban: 2,
} as const;

interface PutDurationProps {
	user: IUser;
	channelID?: number;
	handleType: typeof DurationType[keyof typeof DurationType];
	isVisible: boolean;
	setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
	setIsDurationVisible: React.Dispatch<React.SetStateAction<boolean>>;
	setDurationType: React.Dispatch<React.SetStateAction<typeof DurationType[keyof typeof DurationType]>>;
}

const PutDuration: React.FC<PutDurationProps> = ({ user, channelID, handleType, isVisible, setDurationType, setIsDurationVisible, setRefresh}) => {
	const [duration, setDuration] = useState<number>(60);

	function changeDuration(e: React.ChangeEvent<HTMLInputElement>) {
		if (e?.target?.value?.length === 0 ?? true) return setDuration(1);
		if (!e.target.value && !e.target.value.length && !e.target.value.match(/[0-9]/g) && e.target.value !== "0") return setDuration(0);
		const value = parseInt(e.target.value);
		if (value < 0) return setDuration(0);
		setDuration(parseInt(e.target.value));
	}

	function handleDuration() {
		if (!duration || duration <= 0 || !channelID) return;
		if (handleType === DurationType.Ban) {
			apiReq.putApi.putBanUser(channelID, user.UserID, duration * 60)
				.then(() => {
					NotificationManager.success(`You banned ${user.nickname} (${user.login}) for ${duration} minutes.`);
					setRefresh(true);
				})
				.catch(() => {
					NotificationManager.error(`You can\'t ban ${user.nickname} (${user.login})`);
				})
			}
			else if (handleType === DurationType.Mute) {
				apiReq.putApi.putMuteUser(channelID, user.UserID, duration* 60)
				.then(() => {
					NotificationManager.success(`You muted ${user.nickname} (${user.login}) for ${duration} minutes.`);
					setRefresh(true);
				})
				.catch(() => {
					NotificationManager.error(`You can\'t mute ${user.nickname} (${user.login})`);
				})
		}
		setDurationType(DurationType.none);
		setIsDurationVisible(!isVisible);
	}

	return (
		<>
			{isVisible && (
				<div id="muteDuration" style={{minWidth:"fit-content"}}>
					<label htmlFor="duration">Duration (in minutes)<h6>0 for infinite</h6></label>
					<input
						type="number"
						name="duration"
						id="duration"
						placeholder="duration in minutes"
						value={duration}
						onChange={(e) => changeDuration(e)}
					/>
					{isVisible && (<button onClick={handleDuration} style={{ verticalAlign: "-webkit-baseline-middle" }}>
						<Image
							src="/confirm.svg"
							alt="validate"
							width={20}
							height={20}
							style={{ marginTop: "-8px", marginLeft: "2%", width: "inherits", position: "absolute" }}
						/>
					</button>)}
				</div>
			)}
		</>
	);
}

export default PutDuration;