import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '$env/static/private';

import type { Handle } from '@sveltejs/kit';
import type { userType } from '$lib/models';

export const handle: Handle = async ({ event, resolve }) => {
	// get cookies from browser
	const session = event.cookies.get('session');

	if (!session) {
		// if there is no session load page as normal
		return await resolve(event);
	}

	// find the user based on the session
	let user: userType | undefined;
	jwt.verify(session, ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) return; //invalid token
		user = decoded?.userInfo;
	});
	console.log('user from hook', user);
	// if `user` exists set `events.local`
	if (user) {
		event.locals.user = user;
	}

	// load page as normal
	return await resolve(event);
};
