export type User = {
	id: string;
	email: string;
	hashedPassword: string;
	createdAt: string;
	updatedAt: string;
	userType: string;
	fullName: string;
};

export type FetchSelfResponse = {
	self: User;
};

export type CreateUserParams = {
	email: string;
	password: string;
	fullName: string;
	userType: string;
};
