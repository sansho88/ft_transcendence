'use client'

import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { LoggedContext } from '@/context/GameContext';

export default function ProfileUser({params}: {params: { username: string}}) {
	const [isUserTargetExist, setIsUserTargetExist] = useState<boolean>(false);
	const {logged} = useContext(LoggedContext);

	console.log("PorfileUser HelloWorld");

	useEffect(() => {
		console.log("PorfileUser useEffect HelloWorld");

		// requete api pour avoir les infos de l'user sur localhost:8000/api/users/username
		axios
			.get(`/localhost:8000/api/users/${params.username}`)
			.then((reponse) => {
				if (reponse.status === 200) {
					setIsUserTargetExist(true);
				}
				return;
			})
			.catch((e) => {
				console.log(e);
			});
	});

	return (
		<div className="flex justify-center items-center">
			{logged ? (
				isUserTargetExist ? (
					<div>{params.username}: 404 NOT FOUND</div>
				) : (
					<div>
						<h1>PROFILE </h1>
						<div className=" flex justify-center flex-grow space-x-10 p-20">
							<div>username: {params.username}</div>
						</div>
					</div>
				)
			) : (
				<div>Your Are Not Logged</div>
			)}
		</div>
	);
}
