export type Bookmark = {
	id: string;
	userId: string;
	lectureId: string;
	timestampSeconds: number;
	label: string;
	createdAt: string;
	updatedAt: string;
};

export type FetchBookmarksResponse = {
	bookmarks: Bookmark[];
};

export type CreateBookmarkParams = {
	lectureId: string;
	timestampSeconds: number;
	label: string;
};
