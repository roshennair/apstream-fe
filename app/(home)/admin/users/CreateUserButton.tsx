'use client';

import Button from '@/app/_components/Button';
import { useRouter } from 'next/navigation';

const CreateUserButton = () => {
	const { push } = useRouter();

	return (
		<Button onClick={() => push('/admin/users/create')}>Create user</Button>
	);
};

export default CreateUserButton;
