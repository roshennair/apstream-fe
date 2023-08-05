import { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import { ReactNode } from 'react';
import { AuthProvider, RouteProtector } from './_contexts/auth';
import './globals.css';

const workSans = Work_Sans({
	subsets: ['latin'],
	display: 'swap',
});

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={workSans.className}>
			<body>
				<AuthProvider>
					<RouteProtector>{children}</RouteProtector>
				</AuthProvider>
			</body>
		</html>
	);
}

export const metadata: Metadata = { title: 'APStream' };
