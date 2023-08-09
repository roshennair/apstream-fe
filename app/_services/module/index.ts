import { FetchUsersResponse } from '../user/types';
import type {
	CreateModuleParams,
	FetchAllModulesResponse,
	FetchModuleResponse,
	ModuleAssignmentParams,
} from './types';

const MODULE_API_URL = process.env.NEXT_PUBLIC_API_URL + '/module';

export const fetchAllModules = async () => {
	const response = await fetch(MODULE_API_URL, {
		credentials: 'include',
		cache: 'no-store',
	});
	if (!response.ok) {
		throw await response.json();
	}
	return (await response.json()) as FetchAllModulesResponse;
};

export const fetchModule = async (id: string) => {
	const response = await fetch(`${MODULE_API_URL}/${id}`, {
		credentials: 'include',
		cache: 'no-store',
	});
	if (!response.ok) {
		throw await response.json();
	}
	return (await response.json()) as FetchModuleResponse;
};

export const createModule = async (params: CreateModuleParams) => {
	const response = await fetch(MODULE_API_URL, {
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

export const fetchUsersAssignedToModule = async (moduleId: string) => {
	const response = await fetch(`${MODULE_API_URL}/${moduleId}/users`, {
		credentials: 'include',
		cache: 'no-store',
	});
	if (!response.ok) {
		throw await response.json();
	}
	return (await response.json()) as FetchUsersResponse;
};

export const assignUserToModule = async (params: ModuleAssignmentParams) => {
	const { moduleId, userId } = params;

	const response = await fetch(
		`${MODULE_API_URL}/${moduleId}/assign/${userId}`,
		{
			method: 'POST',
			credentials: 'include',
			cache: 'no-store',
		}
	);
	if (!response.ok) {
		throw await response.json();
	}
	return;
};

export const unassignUserFromModule = async (
	params: ModuleAssignmentParams
) => {
	const { moduleId, userId } = params;

	const response = await fetch(
		`${MODULE_API_URL}/${moduleId}/unassign/${userId}`,
		{
			method: 'POST',
			credentials: 'include',
			cache: 'no-store',
		}
	);
	if (!response.ok) {
		throw await response.json();
	}
	return;
};
