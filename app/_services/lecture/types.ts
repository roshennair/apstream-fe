export type Lecture = {
	id: string;
	moduleId: string;
	videoId: string;
	title: string;
	description: string;
	durationSeconds: number;
	tags: string[];
	createdAt: string;
	updatedAt: string;
};

export type FetchLecturesResponse = {
	lectures: Lecture[];
};

export type FetchLectureResponse = {
	lecture: Lecture;
};
