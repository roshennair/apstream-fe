'use client';

import Button from '@/app/_components/Button';
import { isFailureResponse } from '@/app/_services';
import { fetchAssignedModules } from '@/app/_services/module';
import { Module } from '@/app/_services/module/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

const LecturerModulesTable = () => {
	const [modules, setModules] = useState<Module[] | null>(null);

	const fetchModules = async () => {
		try {
			const { modules } = await fetchAssignedModules();
			setModules(modules);
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error fetching modules');
			}
		}
	};

	useEffect(() => {
		fetchModules();
	}, []);

	return (
		<>
			<table className="w-full">
				<thead className="bg-gray-50">
					<tr className="border-y">
						<th className="text-left p-2">Code</th>
						<th className="text-left p-2">Name</th>
						<th className="text-left p-2"></th>
					</tr>
				</thead>
				<tbody>
					{!modules ? (
						<tr>
							<td colSpan={3} className="text-center p-2">
								Loading...
							</td>
						</tr>
					) : modules.length === 0 ? (
						<tr>
							<td colSpan={3} className="text-center p-2">
								No modules found
							</td>
						</tr>
					) : (
						modules.map((module) => (
							<tr key={module.id} className="border-y">
								<td className="p-2">{module.code}</td>
								<td className="p-2">{module.name}</td>
								<td className="p-2 text-right">
									<Link
										href={`/lecturer/modules/${module.id}`}
									>
										<Button>Manage</Button>
									</Link>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
			<Toaster
				toastOptions={{
					className: 'font-sans',
					position: 'bottom-center',
				}}
			/>
		</>
	);
};

export default LecturerModulesTable;
