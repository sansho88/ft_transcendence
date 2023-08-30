import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from "@/context/providers";
import { NavBar } from '@/components/(ben_proto)/DevTools/NavBarDev'


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

					</Providers>
				</div>
			</body>
		</html>
	)
}
