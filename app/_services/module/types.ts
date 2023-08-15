export type Module = {
	id: string;
	name: string;
	code: string;
	createdAt: string;
	updatedAt: string;
};

export type FetchModulesResponse = {
	modules: Module[];
};

export type CreateModuleParams = {
	name: string;
	code: string;
};

export type FetchModuleResponse = {
	module: Module;
};

export type ModuleAssignmentParams = {
	moduleId: string;
	userId: string;
};
