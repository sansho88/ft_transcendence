import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from "@/context/providers";
import { NavBar } from '@/components/DevTools/NavBarDev'


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
				<Providers>
					{children}
					<NavBar className='absolute bottom-0 right-0 w-screen  bg-white bg-opacity-5' />
				</Providers>
			</body>
		</html>
	)
}
