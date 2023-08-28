import { Upload } from 'tus-js-client';
import type { FetchBookmarksResponse } from '../bookmark/types';
import type { FetchCommentsResponse } from '../comment/types';
import type { FetchNoteResponse } from '../note/types';
import type {
	CreateLectureParams,
	CreateLectureResponse,
	FetchLectureResponse,
	UploadLectureParams,
} from './types';

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

export const fetchNoteByLectureId = async (lectureId: string) => {
	const response = await fetch(`${LECTURE_API_URL}/${lectureId}/note`, {
		credentials: 'include',
		cache: 'no-store',
	});
	if (!response.ok) {
		throw await response.json();
	}
	return (await response.json()) as FetchNoteResponse;
};

export const fetchBookmarksByLectureId = async (lectureId: string) => {
	const response = await fetch(`${LECTURE_API_URL}/${lectureId}/bookmarks`, {
		credentials: 'include',
		cache: 'no-store',
	});
	if (!response.ok) {
		throw await response.json();
	}
	return (await response.json()) as FetchBookmarksResponse;
};

export const createLecture = async (params: CreateLectureParams) => {
	const response = await fetch(LECTURE_API_URL, {
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
	return (await response.json()) as CreateLectureResponse;
};

const generateAuthSignature = async (
	videoId: string,
	expirationTime: number
) => {
	const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || '';
	const apiKey = process.env.NEXT_PUBLIC_BUNNY_API_KEY || '';

	const message = libraryId + apiKey + expirationTime + videoId;

	const messageBuffer = new TextEncoder().encode(message);
	const hashBuffer = await crypto.subtle.digest('SHA-256', messageBuffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('');
	return hashHex;
};

export const uploadLecture = async (params: UploadLectureParams) => {
	const { videoId, videoFile } = params;

	const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
	const authSignature = await generateAuthSignature(videoId, expirationTime);
	const uploadEndpoint = process.env.NEXT_PUBLIC_BUNNY_UPLOAD_URL || '';
	const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || '';

	const upload = new Upload(videoFile, {
		endpoint: uploadEndpoint,
		retryDelays: [0, 3000, 5000, 10000, 20000, 60000, 60000],
		headers: {
			AuthorizationSignature: authSignature,
			AuthorizationExpire: expirationTime.toString(),
			VideoId: videoId,
			LibraryId: libraryId,
		},
		metadata: {
			filetype: videoFile.type,
		},
		onError: (error) => console.log(error),
		onProgress: (bytesUploaded, bytesTotal) => {
			const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
			console.log(
				`${bytesUploaded} bytes / ${bytesTotal} bytes (${percentage}%)`
			);
		},
		onSuccess: () => console.log('Upload complete!'),
	});

	upload.findPreviousUploads().then((previousUploads) => {
		if (previousUploads.length) {
			upload.resumeFromPreviousUpload(previousUploads[0]);
		}
	});

	upload.start();
};
