'use client';

import Button from '@/app/_components/Button';
import { fetchAllModules } from '@/app/_services/module';
import { Module } from '@/app/_services/module/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const ModulesTable = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [modules, setModules] = useState<Module[]>([]);

	const fetchModules = async () => {
		const { modules } = await fetchAllModules();
		setModules(modules);
		setIsLoading(false);
	};

	useEffect(() => {
		fetchModules();
	}, []);

	return (
		<table className="w-full">
			<thead className="bg-gray-50">
				<tr className="border-y">
					<th className="text-left p-2">Code</th>
					<th className="text-left p-2">Name</th>
					<th className="text-left p-2"></th>
				</tr>
			</thead>
			<tbody>
				{isLoading ? (
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
									href={`/admin/modules/manage/${module.id}`}
								>
									<Button>Manage</Button>
								</Link>
							</td>
						</tr>
					))
				)}
			</tbody>
		</table>
	);
};

export default ModulesTable;
