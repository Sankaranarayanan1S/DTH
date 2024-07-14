// using an enum for user roles to avoid typos
// if you're not using TypeScript use an object
export enum Roles {
	ADMIN = "ADMIN",
	USER = "USER"
}

export type userType = {
	username: string;
	password: string;
	userAuthToken: string;
	role: Roles;
	status: number;
	firstTime: number;
};
