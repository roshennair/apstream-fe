import { Metadata } from 'next';
import CreateModuleForm from './CreateModuleForm';

const CreateModulePage = () => {
	return <CreateModuleForm />;
};

export default CreateModulePage;

export const metadata: Metadata = { title: 'Create Module | APStream' };
