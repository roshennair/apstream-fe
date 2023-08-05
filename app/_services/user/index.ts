import type { CreateUserParams, FetchSelfResponse } from './types';

const USER_API_URL = process.env.NEXT_PUBLIC_API_URL + '/user';

export const fetchSelf = async () => {
	const response = await fetch(USER_API_URL, {
		credentials: 'include',
		cache: 'no-store',
	});
	if (!response.ok) {
		throw await response.json();
	}
	return (await response.json()) as FetchSelfResponse;
};

export const createUser = async (params: CreateUserParams) => {
	const response = await fetch(USER_API_URL, {
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
	return;
};
