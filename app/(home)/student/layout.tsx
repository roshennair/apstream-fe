'use client';

import SideBar from '@/app/_components/SideBar';
import SideBarLink from '@/app/_components/SideBarLink';
import { ReactNode } from 'react';

const StudentLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="flex gap-5">
			<SideBar>
				<SideBarLink link={'/student'}>Dashboard</SideBarLink>
			</SideBar>
			<div className="p-2">{children}</div>
		</div>
	);
};

export default StudentLayout;
