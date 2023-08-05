import type { LoginParams, LoginResponse } from './types';

const AUTH_API_URL = process.env.NEXT_PUBLIC_API_URL + '/auth';

export const login = async (params: LoginParams) => {
	const response = await fetch(`${AUTH_API_URL}/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(params),
		cache: 'no-store',
	});
	if (!response.ok) {
		throw await response.json();
	}
	return (await response.json()) as LoginResponse;
};

export const logout = async () => {
	const response = await fetch(`${AUTH_API_URL}/logout`, {
		method: 'POST',
		credentials: 'include',
		cache: 'no-store',
	});
	if (!response.ok) {
		throw await response.json();
	}
	return;
};
