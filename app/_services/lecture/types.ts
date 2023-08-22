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

export type CreateLectureParams = {
	moduleId: string;
	title: string;
	description: string;
	tags: string;
	durationSeconds: number;
};

export type CreateLectureResponse = {
	lectureId: string;
	videoId: string;
};

export type UploadLectureParams = {
	videoId: string;
	videoFile: File;
};
