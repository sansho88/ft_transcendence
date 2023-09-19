'use client'

import { IInput } from '@/shared/types';

export default function PodInput({className, props}: {className: string, props: IInput}) {
	
	!className ? 
		className='bg-neutral-800 text-red-500 rounded-lg h-8 p-4' 
		: null;

	return (
		<input autoFocus type={props.type} onChange={props.onChange()} onKeyDown={props.onKeyDown} className={className}></input>
	)
}

