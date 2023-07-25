'use client'

import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { LoggedContext, UserContext } from '@/context/globalContext';

export default function ProfileUser({params}: {params: { username: string}}) {
	const [isUserTargetExist, setIsUserTargetExist] = useState<boolean>(false);
	const {logged} = useContext(LoggedContext);
	const {userContext} = useContext(UserContext);


	useEffect(() => {

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
		<div className="flex  w-screen justify-center items-center">
			{logged ? (
				isUserTargetExist ? (
					<div>{params.username}: 404 NOT FOUND</div>
				) : (
					<div>
						<div className=" flex flex-col space-x-10">
						<h1 className=' text-3xl'>PROFILE </h1>
							<div>login: {userContext?.login}</div>
							<div>nickanme: {userContext?.nickname}</div>
							<div>avatar_path: {userContext?.avatar_path}</div>
						</div>
					</div>
				)
			) : (
				<div>Your Are Not Logged</div>
			)}
		</div>
	);
}
