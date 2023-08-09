'use client';

import Button from '@/app/_components/Button';
import { useRouter } from 'next/navigation';

const CreateModuleButton = () => {
	const { push } = useRouter();

	return (
		<Button onClick={() => push('/admin/modules/create')}>
			Create module
		</Button>
	);
};

export default CreateModuleButton;
