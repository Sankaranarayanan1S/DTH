import { z } from 'zod';
import { course_name } from './course_name';
import { discipline } from './discipline';

export const formSchema = z.object({
	urls: z
		.array(z.string().url({ message: 'Please enter a valid URL.' }))
		.min(2, 'You must include at least two URLs on your profile.')
		.default(['', ''])
});

const channelNumbers = [
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'10',
	'40',
	'11',
	'12',
	'13',
	'14',
	'15',
	'16',
	'17',
	'18',
	'19',
	'20',
	'21',
	'22',
	'23',
	'24',
	'25',
	'26',
	'27',
	'28',
	'29',
	'30',
	'31',
	'32',
	'33',
	'34',
	'35',
	'36',
	'37',
	'38',
	'39',
	'cross content'
] as const;
const courseNames = Object.values(course_name).flat();
const disciplines = Object.values(discipline).flat();
const financialYears = ['yes', 'no'] as const;
const courseStatuses = ['completed', 'ongoing'] as const;
const languages = [
	'assamese',
	'bengali',
	'english',
	'gujarati',
	'hindi',
	'kannada',
	'kashmiri',
	'malayalam',
	'marathi',
	'punjabi',
	'sanskrit',
	'tamil',
	'telugu',
	'urdu'
] as const;
const courseCategories = [
	'studio_based_recording',
	'live_sessions',
	'conferences',
	'workshops',
	'special_series'
] as const;

const nonEmptyString = z.string().min(1, 'This field cannot be empty');

export const formEntrySchema = z
	.object({
		id: z.coerce.number().optional(),
		chennal_no: z.enum(channelNumbers, { message: 'Invalid channel number' }),
		course_name: z.enum(courseNames, { message: 'Invalid course name' }),
		coursename_others: z.string().optional(),
		discipline: z.enum(disciplines, { message: 'Invalid discipline' }),
		discipline_others: z.string().optional(),
		total_duration: z
			.string()
			.regex(/^(\d+):([0-5]?\d):([0-5]?\d)$/, {
				message: 'Invalid video duration format. Use HH:MM:SS'
			})
			.refine((val) => {
				const [hours, minutes, seconds] = val.split(':').map(Number);
				return minutes < 60 && seconds < 60;
			}, 'Minutes and seconds must be less than 60'),
		course_reported_financial_year: z.enum(financialYears, { message: 'Invalid financial year' }),
		quater: nonEmptyString,
		sme_name: nonEmptyString,
		sme_institute: nonEmptyString,
		no_of_videos: z.coerce.number().positive(),
		course_status: z.enum(courseStatuses, { message: 'Invalid course status' }),
		language: z.enum(languages, { message: 'Invalid language' }),
		course_category: z.enum(courseCategories, { message: 'Invalid course category' }),
		coordinating_institute: nonEmptyString
	})
	.superRefine((data, ctx) => {
		if (data.course_name.toLowerCase() === 'other') {
			console.log('course_name_data:', data);
			if (!data.coursename_others || data.coursename_others.trim() === '') {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Course name (others) is required when 'Other' is selected and cannot be empty",
					path: ['coursename_others']
				});
			}
		}
		if (data.discipline.toLowerCase() === 'other') {
			console.log('discipline_data:', data);
			if (!data.discipline_others || data.discipline_others.trim() === '') {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Discipline (others) is required when 'Other' is selected and cannot be empty",
					path: ['discipline_others']
				});
			}
		}
	});

export const formSchema2 = z.object({
	entries: z
		.array(formEntrySchema)
		.min(1, 'At least one entry is required')
		.default([
			{
				chennal_no: '' as '1',
				course_name: '',
				coursename_others: '',
				discipline: '',
				discipline_others: '',
				total_duration: '',
				course_reported_financial_year: '' as 'no',
				quater: '',
				sme_name: '',
				sme_institute: '',
				no_of_videos: '' as unknown as number,
				course_status: '' as 'completed',
				language: '' as 'english',
				course_category: '' as 'studio_based_recording',
				coordinating_institute: ''
			}
		])
});

export type FormSchema2 = typeof formSchema2;
export type FormSchema = typeof formSchema;
export type FormEntrySchema = typeof formEntrySchema;
