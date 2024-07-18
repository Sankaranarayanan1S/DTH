import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Action, Actions, PageServerLoad } from './$types';
import type { userType } from '$lib/models';
import { db } from '$lib/server/dbConfig';
import { ACCESS_TOKEN_SECRET } from '$env/static/private';

export const load: PageServerLoad = async ({ locals }) => {
	// redirect user if logged in
	if (locals.user) {
		throw redirect(302, '/');
	}
};

const login: Action = async ({ cookies, request }) => {
	console.log('login action');
	const data = await request.formData();
	const username = data.get('username');
	const password = data.get('password');

	if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
		return fail(400, { invalid: true });
	}

	const [[user]]: [[userType]] = await db.execute('SELECT * FROM login WHERE user_name = ?', [
		username
	]);
	console.log('user from login', user);
	if (!user) {
		return fail(400, { credentials: true });
	}

	const userPassword = await bcrypt.compare(password, user.password);

	if (!userPassword) {
		return fail(400, { credentials: true });
	}

	// generate new auth token just in case
	const accessToken = jwt.sign(
		{
			userInfo: {
				username: user.user_name,
				role: user.role,
				status: user.status || 'active'
			}
		},
		ACCESS_TOKEN_SECRET,
		{ expiresIn: '1d' }
	);
	console.log('accessToken:', accessToken);
	const [authenticatedUserResult] = await db.execute(
		'UPDATE login SET refreshtoken = ? WHERE user_name = ?',
		[accessToken, user.user_name]
	);
	console.log('authenticatedUserResult:', authenticatedUserResult);
	cookies.set('session', accessToken, {
		// send cookie for every page
		path: '/',
		// server side only cookie so you can't use `document.cookie`
		httpOnly: true,
		// only requests from same site can send cookies
		// https://developer.mozilla.org/en-US/docs/Glossary/CSRF
		sameSite: 'strict',
		// only sent over HTTPS in production
		secure: process.env.ENV === 'production',
		// set cookie to expire after a month
		maxAge: 60 * 60 * 24 * 30
	});

	// redirect the user
	throw redirect(302, '/');
};

export const actions: Actions = { default: login };
