import { Metadata } from 'next';
import localFont from 'next/font/local';
import { ReactNode } from 'react';
import 'video.js/dist/video-js.css';
import { AuthProvider, RouteProtector } from './_contexts/auth';
import './globals.css';

const workSans = localFont({
	src: '../public/WorkSans.ttf',
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
