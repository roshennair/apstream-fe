import { Metadata } from 'next';
import CreateUserForm from './CreateUserForm';

const CreateUserPage = () => {
	return <CreateUserForm />;
};

export default CreateUserPage;

export const metadata: Metadata = { title: 'Create User | APStream' };
