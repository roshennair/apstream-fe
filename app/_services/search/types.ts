import type { User } from '../user/types';

export type SearchLecturersUnassignedToModuleParams = {
	lecturerQuery: string;
	moduleId: string;
};

export type SearchLecturersResponse = {
	lecturers: User[];
};

export type SearchStudentsUnassignedToModuleParams = {
	studentQuery: string;
	moduleId: string;
};

export type SearchStudentsResponse = {
	students: User[];
};
