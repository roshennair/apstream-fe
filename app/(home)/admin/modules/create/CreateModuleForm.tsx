'use client';

import Button from '@/app/_components/Button';
import FormInput from '@/app/_components/FormInput';
import { isFailureResponse } from '@/app/_services';
import { createModule } from '@/app/_services/module';
import { CreateModuleParams } from '@/app/_services/module/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import { BiArrowBack } from 'react-icons/bi';
import { z } from 'zod';

const createModuleFormSchema = z.object({
	name: z.string(),
	code: z.string().regex(/^[A-Z]+$/, {
		message: 'Module code must be uppercase',
	}),
});

const CreateModuleForm = () => {
	const { push } = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<CreateModuleParams>({
		resolver: zodResolver(createModuleFormSchema),
	});
	const [isLoading, setIsLoading] = useState(false);

	const handleCreateModule: SubmitHandler<CreateModuleParams> = async (
		data
	) => {
		try {
			setIsLoading(true);
			await createModule(data);
			toast.success('Module created');
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error creating module');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className="flex items-center">
				<BiArrowBack
					title="Back"
					className="text-2xl text-blue-600 cursor-pointer"
					onClick={() => push('/admin/modules')}
				/>
				<h1 className="text-3xl font-bold pl-3">Create Module</h1>
			</div>
			<div className="mt-5 max-w-md">
				<form
					className="flex flex-col gap-3"
					onSubmit={handleSubmit(handleCreateModule)}
				>
					<FormInput
						register={register}
						label="Module name"
						name="name"
						required
						error={errors.name}
					/>
					<FormInput
						register={register}
						label="Module code"
						name="code"
						required
						error={errors.code}
					/>
					<div className="flex justify-end">
						<Button disabled={isLoading || !isValid} type="submit">
							{isLoading ? 'Loading...' : 'Create'}
						</Button>
					</div>
					<Toaster
						toastOptions={{
							className: 'font-sans',
							position: 'bottom-center',
						}}
					/>
				</form>
			</div>
		</>
	);
};

export default CreateModuleForm;
