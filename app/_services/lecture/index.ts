import type { FetchCommentsResponse } from '../comment/types';
import type { FetchLectureResponse } from './types';

const LECTURE_API_URL = process.env.NEXT_PUBLIC_API_URL + '/lecture';

export const fetchLecture = async (id: string) => {
	const response = await fetch(`${LECTURE_API_URL}/${id}`, {
		credentials: 'include',
		cache: 'no-store',
	});
	if (!response.ok) {
		throw await response.json();
	}
	return (await response.json()) as FetchLectureResponse;
};

export const fetchCommentsByLectureId = async (lectureId: string) => {
	const response = await fetch(`${LECTURE_API_URL}/${lectureId}/comments`, {
		credentials: 'include',
		cache: 'no-store',
	});
	if (!response.ok) {
		throw await response.json();
	}
	return (await response.json()) as FetchCommentsResponse;
};
