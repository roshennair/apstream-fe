export type User = {
	id: string;
	email: string;
	hashedPassword: string;
	createdAt: string;
	updatedAt: string;
	userType: 'admin' | 'lecturer' | 'student';
	fullName: string;
};

export type FetchUserResponse = {
	user: User;
};

export type CreateUserParams = {
	email: string;
	password: string;
	fullName: string;
	userType: 'admin' | 'lecturer' | 'student';
};

export type FetchUsersResponse = {
	users: User[];
};
