'use client';

import { fetchAllUsers } from '@/app/_services/user';
import { User } from '@/app/_services/user/types';
import { useEffect, useState } from 'react';

const UsersTable = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [users, setUsers] = useState<User[]>([]);

	const fetchUsers = async () => {
		const { users } = await fetchAllUsers();
		setUsers(users);
		setIsLoading(false);
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	return (
		<table className="w-full">
			<thead className="bg-gray-50">
				<tr className="border-y">
					<th className="text-left p-2">Email</th>
					<th className="text-left p-2">Full name</th>
					<th className="text-left p-2">User type</th>
				</tr>
			</thead>
			<tbody>
				{isLoading ? (
					<tr>
						<td colSpan={3} className="text-center p-2">
							Loading...
						</td>
					</tr>
				) : (
					users.map((user) => (
						<tr key={user.id} className="border-y">
							<td className="p-2">{user.email}</td>
							<td className="p-2">{user.fullName}</td>
							<td className="p-2 capitalize">{user.userType}</td>
						</tr>
					))
				)}
			</tbody>
		</table>
	);
};

export default UsersTable;
