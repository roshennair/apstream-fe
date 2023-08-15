import type { Metadata } from 'next';
import ManageModule from './ManageModule';

const ManageModulePage = ({ params: { id } }: { params: { id: string } }) => {
	return <ManageModule id={id} />;
};

export default ManageModulePage;

export const metadata: Metadata = { title: 'Manage Module | APStream' };
