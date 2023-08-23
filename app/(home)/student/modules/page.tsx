import ModulesTable from '@/app/_components/ModulesTable';
import { Metadata } from 'next';

const ModulesListPage = () => {
	return (
		<>
			<h1 className="text-3xl font-bold">Modules</h1>
			<div className="mt-5">
				<ModulesTable userType="student" />
			</div>
		</>
	);
};

export default ModulesListPage;

export const metadata: Metadata = { title: 'Modules | APStream' };
