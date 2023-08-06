'use client';

import Button from '../_components/Button';
import { useAuth } from '../_contexts/auth';

const NavBar = () => {
	const { user, logout } = useAuth();

	const handleLogout = async () => {
		await logout();
	};

	return (
		<div className="shadow sticky top-0 w-full bg-white">
			<div className="p-2 flex justify-between items-center mx-auto max-w-7xl">
				<h1 className="font-bold text-xl text-blue-600">APStream</h1>
				<div className="flex items-center">
					<div className="flex items-center">
						<span className="font-semibold">{user?.fullName}</span>
						<span
							className={`text-white text-sm px-1 rounded-full ml-1 ${
								user?.userType === 'admin'
									? 'bg-red-600'
									: user?.userType === 'lecturer'
									? 'bg-green-600'
									: 'bg-yellow-500'
							}`}
						>
							{user?.userType}
						</span>
					</div>
					<Button
						className="bg-blue-600 ml-4 text-white rounded-lg py-1 px-3"
						onClick={handleLogout}
					>
						Log out
					</Button>
				</div>
			</div>
		</div>
	);
};

export default NavBar;
