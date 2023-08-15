import { Metadata } from 'next';
import LecturerModulesTable from './LecturerModulesTable';

const ModulesListPage = () => {
	return (
		<>
			<h1 className="text-3xl font-bold">Modules</h1>
			<div className="mt-5">
				<LecturerModulesTable />
			</div>
		</>
	);
};

export default ModulesListPage;

export const metadata: Metadata = { title: 'Modules | APStream' };
