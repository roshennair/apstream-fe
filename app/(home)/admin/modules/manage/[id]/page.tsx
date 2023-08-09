'use client';

import Button from '@/app/_components/Button';
import { isFailureResponse } from '@/app/_services';
import {
	fetchModule,
	fetchUsersAssignedToModule,
	unassignUserFromModule,
} from '@/app/_services/module';
import { Module } from '@/app/_services/module/types';
import { User } from '@/app/_services/user/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { BiArrowBack } from 'react-icons/bi';

const ModuleUsersTable = ({
	users,
	unassignUser,
	noneMessage,
}: {
	moduleId: string;
	users: User[] | null;
	// eslint-disable-next-line no-unused-vars
	unassignUser: (user: User) => Promise<void>;
	noneMessage?: string;
}) => {
	return (
		<table className="w-full mt-3">
			<thead className="bg-gray-50">
				<tr className="border-y">
					<th className="text-left p-2">Email</th>
					<th className="text-left p-2">Full name</th>
					<th className="text-left p-2"></th>
				</tr>
			</thead>
			<tbody>
				{!users ? (
					<tr>
						<td colSpan={3} className="text-center p-2">
							Loading...
						</td>
					</tr>
				) : users.length === 0 ? (
					<tr>
						<td colSpan={3} className="text-center p-2">
							{noneMessage ?? 'None found for this module'}
						</td>
					</tr>
				) : (
					users.map((user) => (
						<tr key={user.id} className="border-y">
							<td className="p-2">{user.email}</td>
							<td className="p-2">{user.fullName}</td>
							<td className="p-2 text-end">
								<Button
									onClick={() => unassignUser(user)}
									color="red"
								>
									Unassign
								</Button>
							</td>
						</tr>
					))
				)}
			</tbody>
		</table>
	);
};

const ManageModulePage = ({ params: { id } }: { params: { id: string } }) => {
	const { push } = useRouter();
	const [module, setModule] = useState<Module | null>(null);
	const [lecturers, setLecturers] = useState<User[] | null>(null);
	const [students, setStudents] = useState<User[] | null>(null);

	const fetchCurrentModule = async () => {
		try {
			const { module } = await fetchModule(id);
			if (!module) {
				push('/admin/modules');
			}
			setModule(module);
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error fetching module');
			}
		}
	};

	const fetchUsers = async () => {
		try {
			const fetchedLecturers = [];
			const fetchedStudents = [];
			const { users } = await fetchUsersAssignedToModule(id);
			for (const user of users) {
				if (user.userType === 'lecturer') {
					fetchedLecturers.push(user);
				} else if (user.userType === 'student') {
					fetchedStudents.push(user);
				}
			}
			setLecturers(fetchedLecturers);
			setStudents(fetchedStudents);
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error fetching module');
			}
		}
	};

	const unassignUser = async (user: User) => {
		try {
			await unassignUserFromModule({ moduleId: id, userId: user.id });
			if (user.userType === 'lecturer' && lecturers !== null) {
				setLecturers(
					lecturers.filter((lecturer) => lecturer.id !== user.id)
				);
			} else if (user.userType === 'student' && students !== null) {
				setStudents(
					students.filter((student) => student.id !== user.id)
				);
			}
			toast.success('Student successfully assigned to module');
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error assigning student to module');
			}
		}
	};

	useEffect(() => {
		fetchCurrentModule();
		fetchUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div className="flex items-center">
				<BiArrowBack
					title="Back"
					className="text-2xl text-blue-600 cursor-pointer"
					onClick={() => push('/admin/modules')}
				/>
				<h1 className="text-3xl font-bold pl-3">Manage Module</h1>
			</div>
			<div className="mt-5">
				<div>
					<span className="">Selected module:</span>{' '}
					{module ? `${module.name} (${module.code})` : 'Loading...'}
				</div>
				<div className="mt-10">
					<div className="flex justify-between items-end">
						<h1 className="text-lg font-bold">Lecturers</h1>
						<Link href={`/admin/modules/assign-lecturer/${id}`}>
							<Button>Assign lecturer</Button>
						</Link>
					</div>
					<ModuleUsersTable
						moduleId={id}
						users={lecturers}
						unassignUser={unassignUser}
						noneMessage="No lecturers found for this module"
					/>
				</div>
				<div className="mt-10">
					<div className="flex justify-between items-end">
						<h1 className="text-lg font-bold">Students</h1>
						<Link href={`/admin/modules/assign-student/${id}`}>
							<Button>Assign student</Button>
						</Link>
					</div>
					<ModuleUsersTable
						moduleId={id}
						users={students}
						unassignUser={unassignUser}
						noneMessage="No students found for this module"
					/>
				</div>
			</div>
			<Toaster
				toastOptions={{
					className: 'font-sans',
					position: 'bottom-center',
				}}
			/>
		</>
	);
};

export default ManageModulePage;
