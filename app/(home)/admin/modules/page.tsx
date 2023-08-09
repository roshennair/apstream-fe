import { Metadata } from 'next';
import CreateModuleButton from './CreateModuleButton';
import ModulesTable from './ModulesTable';

const ManageModulesPage = () => {
	return (
		<>
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Modules</h1>
				<CreateModuleButton />
			</div>
			<div className="mt-5">
				<ModulesTable />
			</div>
		</>
	);
};

export default ManageModulesPage;

export const metadata: Metadata = { title: 'Modules | APStream' };
