import type { NewNote } from './types';

const NOTE_API_URL = process.env.NEXT_PUBLIC_API_URL + '/note';

export const setNote = async (params: NewNote) => {
	const response = await fetch(NOTE_API_URL, {
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
