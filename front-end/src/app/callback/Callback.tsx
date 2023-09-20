'use client'

import React, { useEffect } from 'react'

export default function Callback() {
	// let code:string | null = '';
	useEffect(()=> {
		const recupURL = new URLSearchParams(window.location.search);
		const code = recupURL.get('code');

		console.log('code = <' + code + '>');

		//FAIRE LA REQUETE API pour obtenir le token
		
		//si success routrer vers home
	}, [])
	return (
		<div>TRY LOGIN 42.... PLEASE WAITING<br/> TOM fou moi un petit loader ici dans /src/app/callback/Callback.tsx MERCI XD)

			{/* <br/>le code est {code} */}
		</div>
	)
}
