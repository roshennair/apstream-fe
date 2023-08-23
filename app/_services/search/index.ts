import type {
	SearchLecturersResponse,
	SearchLecturersUnassignedToModuleParams,
	SearchLecturesResponse,
	SearchStudentsResponse,
	SearchStudentsUnassignedToModuleParams,
} from './types';

const SEARCH_API_URL = process.env.NEXT_PUBLIC_API_URL + '/search';

export const searchLecturersUnassignedToModule = async (
	params: SearchLecturersUnassignedToModuleParams
) => {
	const { lecturerQuery, moduleId } = params;

	const response = await fetch(
		`${SEARCH_API_URL}/users/lecturers/unassigned/${moduleId}?lecturer_query=${lecturerQuery}`,
		{
			credentials: 'include',
			cache: 'no-store',
		}
	);
	if (!response.ok) {
		throw await response.json();
	}
	return (await response.json()) as SearchLecturersResponse;
};

export const searchStudentsUnassignedToModule = async (
	params: SearchStudentsUnassignedToModuleParams
) => {
	const { studentQuery, moduleId } = params;

	const response = await fetch(
		`${SEARCH_API_URL}/users/students/unassigned/${moduleId}?student_query=${studentQuery}`,
		{
			credentials: 'include',
			cache: 'no-store',
		}
	);
	if (!response.ok) {
		throw await response.json();
	}
	return (await response.json()) as SearchStudentsResponse;
};

export const searchLectures = async (query: string) => {
	const response = await fetch(`${SEARCH_API_URL}/lectures?q=${query}`, {
		credentials: 'include',
		cache: 'no-store',
	});
	if (!response.ok) {
		throw await response.json();
	}
	return (await response.json()) as SearchLecturesResponse;
};
