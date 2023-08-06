import { ReactNode } from 'react';
import NavBar from './NavBar';

const HomeLayout = ({ children }: { children: ReactNode }) => {
	return (
		<>
			<NavBar />
			<div className="p-3 max-w-7xl mx-auto">{children}</div>
		</>
	);
};

export default HomeLayout;
