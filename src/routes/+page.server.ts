import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/dbConfig';

export const load: PageServerLoad = async ({ locals }) => {
	// redirect user if not logged in
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	const [[results], fields]: [[results: { institute: string }]] = await db.execute(
		'SELECT institute FROM login WHERE user_name = ?',
		[locals?.user?.username]
	);
	console.log('results:', results);

	return {
		form: await superValidate(zod(formSchema)),
		data: results
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		return {
			form
		};
	}
};
