'use client';

import Button from '@/app/_components/Button';
import FormInput from '@/app/_components/FormInput';
import { isFailureResponse } from '@/app/_services';
import { assignUserToModule, fetchModule } from '@/app/_services/module';
import type { Module } from '@/app/_services/module/types';
import { searchLecturersUnassignedToModule } from '@/app/_services/search';
import type { User } from '@/app/_services/user/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import { BiArrowBack } from 'react-icons/bi';
import { z } from 'zod';

type SearchLecturerParams = {
	query: string;
};

const searchLecturerSchema = z.object({
	query: z.string(),
});

const AssignLecturerPage = ({ params: { id } }: { params: { id: string } }) => {
	const { push } = useRouter();
	const [module, setModule] = useState<Module | null>(null);
	const [isSearching, setIsSearching] = useState(false);
	const [lecturers, setLecturers] = useState<User[] | null>(null);
	const {
		register,
		handleSubmit,
		formState: { isValid },
	} = useForm<SearchLecturerParams>({
		resolver: zodResolver(searchLecturerSchema),
	});
	const [assignedLecturerIds, setAssignedLecturerIds] = useState<string[]>(
		[]
	);

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

	const handleSearchLecturer = async (data: SearchLecturerParams) => {
		try {
			setIsSearching(true);
			const { lecturers } = await searchLecturersUnassignedToModule({
				moduleId: id,
				lecturerQuery: data.query,
			});
			setLecturers(lecturers);
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error searching for lecturers');
			}
		} finally {
			setIsSearching(false);
		}
	};

	const handleAssignLecturer = async (lecturerId: string) => {
		try {
			await assignUserToModule({ moduleId: id, userId: lecturerId });
			setAssignedLecturerIds([...assignedLecturerIds, lecturerId]);
			toast.success('Lecturer successfully assigned to module');
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error assigning lecturer to module');
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
					Assign Lecturer to Module
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
					onSubmit={handleSubmit(handleSearchLecturer)}
					className="flex flex-col max-w-md gap-2"
				>
					<FormInput
						register={register}
						label="Search for lecturers"
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
						{!lecturers ? (
							<tr>
								<td colSpan={3} className="text-left p-2">
									No search performed yet
								</td>
							</tr>
						) : lecturers.length === 0 ? (
							<tr>
								<td colSpan={3} className="text-left p-2">
									No unassigned lecturers found for this
									module
								</td>
							</tr>
						) : (
							lecturers.map((lecturer) => (
								<tr key={lecturer.id} className="border-y">
									<td className="p-2">{lecturer.email}</td>
									<td className="p-2">{lecturer.fullName}</td>
									<td className="p-2 text-end">
										<Button
											disabled={assignedLecturerIds.includes(
												lecturer.id
											)}
											onClick={() =>
												handleAssignLecturer(
													lecturer.id
												)
											}
										>
											{assignedLecturerIds.includes(
												lecturer.id
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

export default AssignLecturerPage;
