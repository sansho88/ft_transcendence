'use client'

import { IInput } from '@/types/types';

export default function PodInput({className, ...props}) {
	
	!className ? 
		className='bg-neutral-800 text-red-500 rounded-lg h-8 p-4' 
		: null;

	return (
		<input {...props} className={className}></input>
	)
}

