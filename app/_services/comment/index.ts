import type { CreateCommentParams } from './types';

const COMMENT_API_URL = process.env.NEXT_PUBLIC_API_URL + '/comment';

export const createComment = async (params: CreateCommentParams) => {
	const response = await fetch(COMMENT_API_URL, {
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

export const deleteComment = async (commentId: string) => {
	const response = await fetch(`${COMMENT_API_URL}/${commentId}`, {
		method: 'DELETE',
		credentials: 'include',
		cache: 'no-store',
	});
	if (!response.ok) {
		throw await response.json();
	}
	return;
};
