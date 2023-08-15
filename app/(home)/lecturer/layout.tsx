'use client';

import SideBar from '@/app/_components/SideBar';
import SideBarLink from '@/app/_components/SideBarLink';
import { ReactNode } from 'react';

const LecturerLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="flex gap-5">
			<SideBar>
				<SideBarLink link={'/lecturer'}>Dashboard</SideBarLink>
				<SideBarLink link={'/lecturer/modules'}>Modules</SideBarLink>
				<SideBarLink link={'/lecturer/upload'}>Upload</SideBarLink>
			</SideBar>
			<div className="p-2 w-full">{children}</div>
		</div>
	);
};

export default LecturerLayout;
