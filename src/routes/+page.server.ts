import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { formSchema, formSchema2 } from '../lib/components/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/dbConfig';

export const load: PageServerLoad = async ({ locals }) => {
	// redirect user if not logged in
	if (!locals.user || locals.user.role != 'admin') {
		throw redirect(302, '/login');
	}
	const [[results], fields]: [[results: { institute: string; admin_institute: string }]] =
		await db.execute('SELECT institute,admin_institute FROM login WHERE user_name = ?', [
			locals?.user?.username
		]);
	console.log('results:', results);

	return {
		form: await superValidate(zod(formSchema)),
		form2: await superValidate(zod(formSchema2)),
		data: results
	};
};

export const actions: Actions = {
	setting: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		console.log('form:', form);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		return {
			form
		};
	},
	qcard: async (event) => {
		const form = await superValidate(event, zod(formSchema2));
		console.log('form:', JSON.stringify(form.data));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		for (const element of form.data.entries) {
			try {
				const [result] = await db.execute(
					`INSERT INTO course_details (
				  chennal_no, course_name, discipline, total_duration, 
				  course_reported_financial_year, quater, sme_name, 
				  sme_institute, no_of_videos, course_status, language, 
				  course_category, coordinating_institute,admin_institute,coursename_others, 
				  discipline_others
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,? ,?, ?, ?, ?, ?)`,
					[
						element.chennal_no,
						element.course_name,
						element.discipline,
						element.total_duration,
						element.course_reported_financial_year,
						element.quater,
						element.sme_name,
						element.sme_institute,
						element.no_of_videos,
						element.course_status,
						element.language,
						element.course_category,
						element.coordinating_institute,
						element.admin_institute,
						element.coursename_others,
						element.discipline_others
					]
				);
				console.log('Inserted row:', result);
			} catch (error) {
				console.error('Error inserting row:', error);
			}
		}
		return {
			form
		};
	}
};
