'use client';

import SideBar from '@/app/_components/SideBar';
import SideBarLink from '@/app/_components/SideBarLink';
import { ReactNode } from 'react';

const AdminLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="flex gap-5">
			<SideBar>
				<SideBarLink link={'/admin'}>Dashboard</SideBarLink>
				<SideBarLink link={'/admin/users'}>Users</SideBarLink>
				<SideBarLink link={'/admin/modules'}>Modules</SideBarLink>
			</SideBar>
			<div className="p-2 w-full">{children}</div>
		</div>
	);
};

export default AdminLayout;
