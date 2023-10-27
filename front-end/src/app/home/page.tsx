'use client'

import React, {useEffect, useState} from 'react'
import HomePage from "@/components/HomePageComponent";
import {authManager} from "@/components/api/ApiReq";
import {useRouter} from "next/navigation";
import LoadingComponent from "@/components/waiting/LoadingComponent";

export default function ShowHomePage() {
	const router = useRouter();
	const [isTokenExists, setIsTokenExists] = useState(false);

	useEffect(() => {
		authManager.setBaseURL('http://' + window.location.href.split(':')[1].substring(2) + ':8000/api/');

		const token = localStorage.getItem("token");
		if (!token)
			router.push("/auth");
		else
			setIsTokenExists(true);
		return;
	});
	return (
			isTokenExists ?
				<HomePage /> : <LoadingComponent/>
	)
}
