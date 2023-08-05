'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../_contexts/auth';

const DashboardPage = () => {
	const { user, logout } = useAuth();
	const { push } = useRouter();

	const handleLogout = async () => {
		await logout();
		push('/login');
	};

	return (
		<>
			<h1>Welcome, {user?.fullName}</h1>
			<button
				className="bg-blue-500 text-white rounded-lg py-1 px-3"
				onClick={handleLogout}
			>
				Log out
			</button>
		</>
	);
};

export default DashboardPage;

// export const metadata: Metadata = { title: 'Dashboard | APStream' };
