export type FailureResponse = {
	error: string;
};

export type Metrics = {
	studentCount: number;
	lecturerCount: number;
	moduleCount: number;
	videoCount: number;
};

export type GetMetricsResponse = {
	metrics: Metrics;
};
