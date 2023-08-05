import type { User } from '../user/types';

export type LoginParams = {
	email: string;
	password: string;
};

export type LoginResponse = {
	user: User;
};
