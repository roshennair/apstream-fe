export type Comment = {
	id: string;
	lectureId: string;
	parentId: string;
	userId: string;
	userName: string;
	content: string;
	createdAt: string;
	updatedAt: string;
};

export type FetchCommentsResponse = {
	comments: Comment[];
};

export type CreateCommentParams = {
	lectureId: string;
	parentId: string;
	content: string;
};
