import type {
	CreateUserParams,
	FetchAllUsersResponse,
	FetchUserResponse,
} from './types';

const USER_API_URL = process.env.NEXT_PUBLIC_API_URL + '/user';

export const fetchSelf = async () => {
	const response = await fetch(`${USER_API_URL}/me`, {
		credentials: 'include',
		cache: 'no-store',
	});
	if (!response.ok) {
		throw await response.json();
	}
	return (await response.json()) as FetchUserResponse;
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

export const fetchUser = async (id: string) => {
	const response = await fetch(`${USER_API_URL}/${id}`, {
		credentials: 'include',
		cache: 'no-store',
	});
	if (!response.ok) {
		throw await response.json();
	}
	return (await response.json()) as FetchUserResponse;
};

export const fetchAllUsers = async () => {
	const response = await fetch(USER_API_URL, {
		credentials: 'include',
		cache: 'no-store',
	});
	if (!response.ok) {
		throw await response.json();
	}
	return (await response.json()) as FetchAllUsersResponse;
};
