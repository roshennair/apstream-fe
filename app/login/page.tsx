import { Metadata } from 'next';
import LoginForm from './LoginForm';

const LoginPage = () => {
	return (
		<div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 to-blue-900">
			<div className="bg-white p-5 rounded-lg max-w-sm w-full">
				<h1 className="font-bold text-2xl text-center mb-5">
					Log In to APStream
				</h1>
				<LoginForm />
			</div>
		</div>
	);
};

export default LoginPage;

export const metadata: Metadata = { title: 'Log In | APStream' };
