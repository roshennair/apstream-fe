'use client';

import Button from '@/app/_components/Button';
import FormInput from '@/app/_components/FormInput';
import FormSelect from '@/app/_components/FormSelect';
import { isFailureResponse } from '@/app/_services';
import { createUser } from '@/app/_services/user';
import type { CreateUserParams } from '@/app/_services/user/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import { BiArrowBack } from 'react-icons/bi';
import { z } from 'zod';

const createUserFormSchema = z.object({
	email: z.string().email(),
	password: z.string(),
	fullName: z.string().nonempty(),
	userType: z.enum(['admin', 'lecturer', 'student']),
});

const userTypeOptionsMap = new Map([
	['Lecturer', 'lecturer'],
	['Student', 'student'],
	['Admin', 'admin'],
]);

const CreateUserForm = () => {
	const { push } = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<CreateUserParams>({
		resolver: zodResolver(createUserFormSchema),
	});
	const [isLoading, setIsLoading] = useState(false);

	const handleCreateUser: SubmitHandler<CreateUserParams> = async (data) => {
		try {
			setIsLoading(true);
			await createUser(data);
			toast.success('User created');
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error creating user');
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
					onClick={() => push('/admin/users')}
				/>
				<h1 className="text-3xl font-bold pl-3">Create User</h1>
			</div>
			<div className="mt-5 max-w-md">
				<form
					className="flex flex-col gap-3"
					onSubmit={handleSubmit(handleCreateUser)}
				>
					<FormInput
						register={register}
						label="Email"
						name="email"
						type="email"
						required
						error={errors.email}
					/>
					<FormInput
						register={register}
						label="Password"
						name="password"
						type="password"
						required
						error={errors.password}
					/>
					<FormInput
						register={register}
						label="Full name"
						name="fullName"
						required
						error={errors.fullName}
					/>
					<FormSelect
						register={register}
						label="User type"
						name="userType"
						required
						error={errors.userType}
						optionValueMap={userTypeOptionsMap}
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

export default CreateUserForm;
