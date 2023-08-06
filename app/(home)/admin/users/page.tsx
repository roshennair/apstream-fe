import { Metadata } from 'next';
import CreateUserButton from './CreateUserButton';
import UsersTable from './UsersTable';

const ManageUsersPage = () => {
	return (
		<>
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Users</h1>
				<CreateUserButton />
			</div>
			<div className="mt-5">
				<UsersTable />
			</div>
		</>
	);
};

export default ManageUsersPage;

export const metadata: Metadata = { title: 'Users | APStream' };
