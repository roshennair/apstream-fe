'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';
import { login, logout } from '../_services/auth';
import type { LoginParams } from '../_services/auth/types';
import { fetchSelf } from '../_services/user';
import type { User } from '../_services/user/types';
import LoadingPage from '../loading';

type AuthContextType = {
	user: User | null;
	isLoading: boolean;
	// eslint-disable-next-line no-unused-vars
	login: (params: LoginParams) => Promise<void>;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	// eslint-disable-next-line no-unused-vars
	const [isLoading, setIsLoading] = useState(true);

	const fetchSelfFromApi = async () => {
		try {
			const { user: self } = await fetchSelf();
			setUser(self);
		} catch {
			setUser(null);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchSelfFromApi();
	}, []);

	const authenticatedLogin = async (params: LoginParams) => {
		const response = await login(params);
		const fetchedUser = response.user;
		setUser(fetchedUser);
	};

	const authenticatedLogout = async () => {
		await logout();
		setUser(null);
		localStorage.clear();
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				login: authenticatedLogin,
				logout: authenticatedLogout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);

export const RouteProtector = ({ children }: { children: ReactNode }) => {
	const { isLoading, user } = useAuth();
	const pathname = usePathname();
	const { push } = useRouter();

	useEffect(() => {
		if (isLoading) return;

		if (!user) {
			push('/login');
		} else if (pathname === '/login') {
			push('/');
		} else {
			switch (user?.userType) {
				case 'admin':
					if (!pathname.startsWith('/admin')) {
						push('/admin');
					}
					break;
				case 'lecturer':
					if (!pathname.startsWith('/lecturer')) {
						push('/lecturer');
					}
					break;
				case 'student':
					if (!pathname.startsWith('/student')) {
						push('/student');
					}
					break;
				default:
					push('/not-found');
			}
		}
	}, [isLoading, user, pathname, push]);

	if (!user && pathname !== '/login') {
		return <LoadingPage />;
	}

	return children;
};
