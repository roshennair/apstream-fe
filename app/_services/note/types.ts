export type Note = {
	userId: string;
	lectureId: string;
	content: string;
	createdAt: string;
	updatedAt: string;
};

export type FetchNoteResponse = {
	note: Note | null;
};

export type NewNote = {
	lectureId: string;
	content: string;
};
