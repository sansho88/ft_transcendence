import { Providers } from "@/context/providers";
import { NavBar } from '@/components/(ben_proto)/DevTools/NavBarDev'
import './globals.css'
import { Inter } from 'next/font/google'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'Pong Pod',
	description: 'ft_transcendence',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<div className='main-background'>
				{/* <div className='bg-gray-950'> */}
				{/* <div className='main-background'> */}
					<Providers>
						{children}
            <NavBar className='absolute bottom-0 right-0 w-screen bg-slate-800' />
					</Providers>
				</div>
			</body>
		</html>
	)
}