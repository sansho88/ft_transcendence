import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='justify-center items-center font-light flex h-screen text-orange-700'>
			<div className='absolute top-[40%] left-[37%] font-extrabold text-5xl text-cyan-500'>PODPONG</div>
      <h1>404</h1>
      <h2>: Not Found</h2>
    </div>
  )
}
