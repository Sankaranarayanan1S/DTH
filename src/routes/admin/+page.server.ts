import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/dbConfig';
import { redirect, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import {
	formEntrySchema,
	formSchema,
	formEntrySchema as formSchema2
} from '$lib/components/schema';
import { zod } from 'sveltekit-superforms/adapters';

type CourseDetails = {
	id: string;
	year: string;
	quater: string;
	chennal_no: string;
	course_name: string;
	discipline: string;
	total_duration: string;
	course_reported_financial_year: string;
	sme_name: string;
	sme_institute: string;
	no_of_videos: string;
	course_status: string;
	language: string;
	course_category: string;
	coordinating_institute: string;
	admin_institute: string;
};

type InstituteQuarterSummary = {
	admin_institute: string;
	Q1_Duration: string | null;
	Q2_Duration: string | null;
	Q3_Duration: string | null;
	Q4_Duration: string | null;
	Total_Duration: string | null;
};

type YoutubeStat = {
	Channels_Name: string;
	national_coordinator: string;
	broadcast_videos: number;
	broadcast_videos_hours: string;
	Youtube_Views: number;
	Youtube_Subscription: number;
	Year: number;
	channel_category: string;
};

type YoutubeSummary = {
	Channel_Number: string | null;
	Total_Broadcast_Videos_Count: number;
	Total_Broadcast_Videos_Hours: string;
	Total_Youtube_Views: number;
	total_youtube_subscription: number;
};

type YoutubeCategorySummary = {
	channel_category: string;
	Years: string | null;
	Total_Broadcast_Videos_Count: number;
	Total_Broadcast_Videos_Hours: string;
	Total_Youtube_Views: number;
	Total_Youtube_Subscription: number;
};

const availableYearsList = ['2024 - 2025', '2025 - 2026', '2026 - 2027'] as const;
const youtubeChannelCategories = ['22 Channels', '32 Channels', '40 Channels', '40 Channels Rearrangement'] as const;
const youtubeYears = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025] as const;

export const load: PageServerLoad = async ({ locals, url }) => {
	// redirect user if not logged in
	if (!locals.user || locals.user.role != 'admin') {
		throw redirect(302, '/login');
	}

	const requestedYear = url.searchParams.get('year');
	const isValidYear =
		requestedYear !== null &&
		availableYearsList.includes(requestedYear as (typeof availableYearsList)[number]);
	const selectedYear = isValidYear
		? (requestedYear as (typeof availableYearsList)[number])
		: availableYearsList[0];

	const requestedYtCategory = url.searchParams.get('ytCategory');
	const requestedYtYear = url.searchParams.get('ytYear');
	const requestedYtSummaryCategory = url.searchParams.get('ytSummaryCategory');
	const selectedYtCategory =
		requestedYtCategory &&
		youtubeChannelCategories.includes(
			requestedYtCategory as (typeof youtubeChannelCategories)[number]
		)
			? (requestedYtCategory as (typeof youtubeChannelCategories)[number])
			: youtubeChannelCategories[0];
	const parsedYtYear = requestedYtYear ? Number(requestedYtYear) : undefined;
	const selectedYtYear =
		parsedYtYear && youtubeYears.includes(parsedYtYear as (typeof youtubeYears)[number])
			? (parsedYtYear as (typeof youtubeYears)[number])
			: youtubeYears[0];
	const selectedYtSummaryCategory =
		requestedYtSummaryCategory &&
		youtubeChannelCategories.includes(
			requestedYtSummaryCategory as (typeof youtubeChannelCategories)[number]
		)
			? (requestedYtSummaryCategory as (typeof youtubeChannelCategories)[number])
			: youtubeChannelCategories[0];

	const [results]: [CourseDetails[]] = await db.execute(
		'SELECT id, year, quater, chennal_no, course_name,coursename_others, discipline, discipline_others, total_duration, course_reported_financial_year, quater, sme_name, sme_institute, no_of_videos, course_status, language, course_category, admin_institute as coordinating_institute FROM course_details'
	);
	const [adminSummary]: [InstituteQuarterSummary[]] = await db.execute(
		"SELECT admin_institute, SEC_TO_TIME(SUM(IF(quater='q1', TIME_TO_SEC(total_duration), 0))) AS Q1_Duration, SEC_TO_TIME(SUM(IF(quater='q2', TIME_TO_SEC(total_duration), 0))) AS Q2_Duration, SEC_TO_TIME(SUM(IF(quater='q3', TIME_TO_SEC(total_duration), 0))) AS Q3_Duration, SEC_TO_TIME(SUM(IF(quater='q4', TIME_TO_SEC(total_duration), 0))) AS Q4_Duration, SEC_TO_TIME(SUM(TIME_TO_SEC(total_duration))) AS Total_Duration FROM course_details WHERE year = ? GROUP BY admin_institute",
		[selectedYear]
	);
	const [youtubeStats]: [YoutubeStat[]] = await db.execute(
		'SELECT Channels_Name, national_coordinator, broadcast_videos, broadcast_videos_hours, Youtube_Views, Youtube_Subscription, Year, channel_category FROM youtube_statistics WHERE LOWER(channel_category) = LOWER(?) AND Year = ?',
		[selectedYtCategory, selectedYtYear]
	);
	
	// Fetch YouTube summary data
	const [youtubeSummary]: [YoutubeSummary[]] = await db.execute(
		`SELECT IFNULL(Channel_Number, 'TOTAL') AS Channel_Number, 
			SUM(broadcast_videos) AS Total_Broadcast_Videos_Count, 
			CONCAT( 
				SUM(SUBSTRING_INDEX(broadcast_videos_hours, ':', 1)), ':', 
				LPAD( FLOOR( SUM(SUBSTRING_INDEX(SUBSTRING_INDEX(broadcast_videos_hours, ':', 2), ':', -1)) + SUM(SUBSTRING_INDEX(broadcast_videos_hours, ':', -1)) / 60 ) % 60 ,2,'0'), ':', 
				LPAD( SUM(SUBSTRING_INDEX(broadcast_videos_hours, ':', -1)) % 60 ,2,'0') 
			) AS Total_Broadcast_Videos_Hours, 
			SUM(Youtube_Views) AS Total_Youtube_Views, 
			SUM(Youtube_Subscription) AS total_youtube_subscription 
		FROM youtube_statistics 
		WHERE LOWER(channel_category) = LOWER(?) 
		GROUP BY Channel_Number WITH ROLLUP`,
		[selectedYtSummaryCategory]
	);

	// Fetch YouTube summary (by category) data (includes TOTAL row)
	const [youtubeCategorySummary]: [YoutubeCategorySummary[]] = await db.execute(
		`SELECT 
			IFNULL(channel_category, 'TOTAL') AS channel_category,
			CASE 
				WHEN GROUPING(channel_category) = 1 THEN NULL
				ELSE GROUP_CONCAT(DISTINCT Year ORDER BY Year)
			END AS Years,
			SUM(broadcast_videos) AS Total_Broadcast_Videos_Count,
			CONCAT(
				SUM(SUBSTRING_INDEX(broadcast_videos_hours, ':', 1)),
				':',
				LPAD(
					FLOOR(
						SUM(SUBSTRING_INDEX(SUBSTRING_INDEX(broadcast_videos_hours, ':', 2), ':', -1))
						+ SUM(SUBSTRING_INDEX(broadcast_videos_hours, ':', -1)) / 60
					) % 60,
				2,'0'),
				':',
				LPAD(
					SUM(SUBSTRING_INDEX(broadcast_videos_hours, ':', -1)) % 60,
				2,'0')
			) AS Total_Broadcast_Videos_Hours,
			SUM(Youtube_Views) AS Total_Youtube_Views,
			SUM(Youtube_Subscription) AS Total_Youtube_Subscription
		FROM youtube_statistics
		WHERE LOWER(channel_category) IN ('22 channels','32 channels','40 channels','40 channels rearrangement')
		GROUP BY channel_category WITH ROLLUP
		HAVING channel_category IS NOT NULL 
		   OR GROUPING(channel_category) = 1;`
	);
	
	console.log('preview:', results);

	return {
		results,
		adminSummary,
		youtubeStats,
		youtubeSummary,
		youtubeCategorySummary,
		selectedYear,
		availableYears: availableYearsList,
		youtubeChannelCategories,
		youtubeYears,
		selectedYtCategory,
		selectedYtYear,
		selectedYtSummaryCategory,
		form2: await superValidate(zod(formEntrySchema))
	};
};

export const actions: Actions = {
	ucard: async (event) => {
		const form = await superValidate(event, zod(formEntrySchema));
		console.log('form:', JSON.stringify(form.data));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		try {
			const [result] = await db.execute(
				`Update  course_details set chennal_no = ?, course_name = ?,coursename_others=?, discipline = ?, total_duration = ?,
				  course_reported_financial_year = ?, quater = ?, sme_name = ?, sme_institute = ?, no_of_videos = ?, course_status = ?, language = ?, 
				  course_category = ?, coordinating_institute = ?, coursename_others = ?, discipline_others = ? where id = ?`,
				[
					form.data.chennal_no,
					form.data.course_name,
					form.data.coursename_others ?? '',
					form.data.discipline,
					form.data.total_duration,
					form.data.course_reported_financial_year,
					form.data.quater,
					form.data.sme_name,
					form.data.sme_institute,
					form.data.no_of_videos,
					form.data.course_status,
					form.data.language,
					form.data.course_category,
					form.data.coordinating_institute,
					form.data.coursename_others ?? '',
					form.data.discipline_others ?? '',
					form.data.id
				]
			);
			console.log('Updated row:', result);
		} catch (error) {
			console.error('Error updating row:', error);
		}
		return {
			form
		};
	}
};
