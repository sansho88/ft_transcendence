'use client'

import React, {useEffect} from 'react'
import HomePage from "@/components/HomePageComponent";
import {authManager} from "@/components/api/ApiReq";

export default function ShowHomePage() {
	useEffect(() => {
		authManager.setBaseURL('http://' + window.location.href.split(':')[1].substring(2) + ':8000/api/');
	})
	console.log("Home page loaded");
	return (
			<HomePage/>
	)
}
