import { fail, redirect } from '@sveltejs/kit';
import type { Action, Actions, PageServerLoad } from './$types';
import bcrypt from 'bcrypt';

import { db } from '$lib/server/dbConfig';

export const load: PageServerLoad = async ({ locals }) => {
	// redirect user if logged in
	if (locals.user) {
		throw redirect(302, '/');
	}
};

const register: Action = async ({ request }) => {
	const data = await request.formData();
	const username = data.get('username');
	const password = data.get('password');

	if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
		return fail(400, { invalid: true });
	}

	const [[user]] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
	// console.log("user from db", user);
	if (user) {
		return fail(400, { user: true });
	}

	// console.log("username:", username, "password:", password);
	const hashedPwd = await bcrypt.hash(password, 10);
	await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPwd]);

	throw redirect(303, '/login');
};

export const actions: Actions = { default: register };
