// using an enum for user roles to avoid typos
// if you're not using TypeScript use an object
export enum Roles {
	ADMIN = 'ADMIN',
	USER = 'USER'
}

export type userType = {
	// username: string;
	// password: string;
	// userAuthToken: string;
	// role: Roles;
	// status: number;
	// firstTime: number;

	id: number;
	user_name: string;
	status: string;
	role: string;
	category: string;
	otp: string;
	refreshtoken: string;
	created_at: string;
	updated_on: string;
	name: string;
	password: string;
	institute: string;
};
