'use client';

import Button from '@/app/_components/Button';
import FormInput from '@/app/_components/FormInput';
import { isFailureResponse } from '@/app/_services';
import { assignUserToModule, fetchModule } from '@/app/_services/module';
import type { Module } from '@/app/_services/module/types';
import { searchStudentsUnassignedToModule } from '@/app/_services/search';
import type { User } from '@/app/_services/user/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import { BiArrowBack } from 'react-icons/bi';
import { z } from 'zod';

type SearchStudentParams = {
	query: string;
};

const searchStudentSchema = z.object({
	query: z.string(),
});

const AssignStudentPage = ({ params: { id } }: { params: { id: string } }) => {
	const { push } = useRouter();
	const [module, setModule] = useState<Module | null>(null);
	const [isSearching, setIsSearching] = useState(false);
	const [students, setStudents] = useState<User[] | null>(null);
	const {
		register,
		handleSubmit,
		formState: { isValid },
	} = useForm<SearchStudentParams>({
		resolver: zodResolver(searchStudentSchema),
	});
	const [assignedStudentIds, setAssignedStudentIds] = useState<string[]>([]);

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

	useEffect(() => {
		fetchCurrentModule();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSearchStudent = async (data: SearchStudentParams) => {
		try {
			setIsSearching(true);
			const { students } = await searchStudentsUnassignedToModule({
				moduleId: id,
				studentQuery: data.query,
			});
			setStudents(students);
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error searching for students');
			}
		} finally {
			setIsSearching(false);
		}
	};

	const handleAssignStudent = async (studentId: string) => {
		try {
			await assignUserToModule({ moduleId: id, userId: studentId });
			setAssignedStudentIds([...assignedStudentIds, studentId]);
			toast.success('Student successfully assigned to module');
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error assigning student to module');
			}
		}
	};

	return (
		<>
			<div className="flex items-center">
				<BiArrowBack
					title="Back"
					className="text-2xl text-blue-600 cursor-pointer"
					onClick={() => push(`/admin/modules/manage/${id}`)}
				/>
				<h1 className="text-3xl font-bold pl-3">
					Assign Student to Module
				</h1>
			</div>
			<div className="mt-5">
				<div>
					<span className="">Selected module:</span>{' '}
					{module ? `${module.name} (${module.code})` : 'Loading...'}
				</div>
			</div>
			<div className="mt-5">
				<form
					onSubmit={handleSubmit(handleSearchStudent)}
					className="flex flex-col max-w-md gap-2"
				>
					<FormInput
						register={register}
						label="Search for students"
						name="query"
						type="search"
						required
					/>
					<div className="flex justify-end">
						<Button
							disabled={isSearching || !isValid}
							type="submit"
						>
							{isSearching ? 'Searching...' : 'Search'}
						</Button>
					</div>
					<Toaster
						toastOptions={{
							className: 'font-sans',
							position: 'bottom-center',
						}}
					/>
				</form>
			</div>
			<div className="mt-5">
				<table className="w-full mt-3">
					<thead className="bg-gray-50">
						<tr className="border-y">
							<th className="text-left p-2">Email</th>
							<th className="text-left p-2">Full name</th>
							<th className="text-left p-2"></th>
						</tr>
					</thead>
					<tbody>
						{!students ? (
							<tr>
								<td colSpan={3} className="text-left p-2">
									No search performed yet
								</td>
							</tr>
						) : students.length === 0 ? (
							<tr>
								<td colSpan={3} className="text-left p-2">
									No unassigned students found for this module
								</td>
							</tr>
						) : (
							students.map((student) => (
								<tr key={student.id} className="border-y">
									<td className="p-2">{student.email}</td>
									<td className="p-2">{student.fullName}</td>
									<td className="p-2">
										<Button
											disabled={assignedStudentIds.includes(
												student.id
											)}
											onClick={() =>
												handleAssignStudent(student.id)
											}
										>
											{assignedStudentIds.includes(
												student.id
											)
												? 'Assigned'
												: 'Assign'}
										</Button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default AssignStudentPage;
