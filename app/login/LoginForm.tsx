'use client';

import FormInput from '@/app/_components/FormInput';
import { useAuth } from '@/app/_contexts/auth';
import { isFailureResponse } from '@/app/_services';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import { z } from 'zod';

type LoginInputs = {
	email: string;
	password: string;
};

const loginFormSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

const LoginForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginInputs>({
		resolver: zodResolver(loginFormSchema),
	});
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();

	const handleLogin: SubmitHandler<LoginInputs> = async (data) => {
		try {
			setIsLoading(true);
			await login(data);
		} catch (res) {
			if (isFailureResponse(res)) {
				toast.error(res.error);
			} else {
				toast.error('Error logging in');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(handleLogin)}
			className="flex flex-col gap-3"
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
			<div className="flex justify-end">
				<button
					className="bg-blue-500 text-white rounded-lg py-1 px-3 disabled:bg-gray-700"
					disabled={isLoading}
					type="submit"
				>
					{isLoading ? 'Loading...' : 'Log In'}
				</button>
			</div>
			<Toaster
				toastOptions={{
					className: 'font-sans',
					position: 'bottom-center',
				}}
			/>
		</form>
	);
};

export default LoginForm;
