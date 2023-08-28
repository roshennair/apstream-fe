import type { CreateBookmarkParams } from './types';

const BOOKMARK_API_URL = process.env.NEXT_PUBLIC_API_URL + '/bookmark';

export const createBookmark = async (params: CreateBookmarkParams) => {
	const response = await fetch(BOOKMARK_API_URL, {
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

export const deleteBookmark = async (bookmarkId: string) => {
	const response = await fetch(`${BOOKMARK_API_URL}/${bookmarkId}`, {
		method: 'DELETE',
		credentials: 'include',
		cache: 'no-store',
	});
	if (!response.ok) {
		throw await response.json();
	}
	return;
};
