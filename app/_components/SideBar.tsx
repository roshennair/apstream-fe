import { ReactNode } from 'react';

const SideBar = ({ children }: { children: ReactNode }) => {
	return <aside className="flex flex-col w-52">{children}</aside>;
};

export default SideBar;
