import { z } from 'zod';
import { course_name } from './course_name';
import { discipline } from './discipline';

export const formSchema = z.object({
	urls: z
		.array(z.string().url({ message: 'Please enter a valid URL.' }))
		.min(2, 'You must include at least two URLs on your profile.')
		.default(['', ''])
});

const channelNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '40', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21',
  '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33',
  '34', '35', '36', '37', '38', '39', 'Cross Content'] as [string, ...string[]];

const courseNames = Object.values(course_name).flat() as [string, ...string[]];
const disciplines = Object.values(discipline).flat() as [string, ...string[]];
const financialYears = ['yes', 'no'] as ['yes', 'no'];
const courseStatuses = ['completed', 'ongoing'] as ['completed', 'ongoing'];
const languages = [
  'assamese', 'bengali', 'english', 'gujarati', 'hindi', 'kannada', 'kashmiri',
  'malayalam', 'marathi', 'punjabi', 'sanskrit', 'tamil', 'telugu', 'urdu','Manipuri', 'Odia', 'Noida'
] as ['assamese', ...string[]];
const courseCategories = [
  'studio_based_recording', 'live_sessions', 'conferences', 'workshops', 'special_series'
] as ['studio_based_recording', ...string[]];

const nonEmptyString = z.string().min(1, 'This field cannot be empty');

export const formEntrySchema = z
.object({
id: z.coerce.number().optional(),
chennal_no: z.union([z.null(), z.enum(channelNumbers)]),
course_name: z.union([z.null(), z.enum(courseNames)]),
coursename_others: z.string().nullable(),
discipline: z.union([z.null(), z.enum(disciplines)]),
discipline_others: z.string().nullable(),
total_duration: z.union([
  z.null(),
  z.string()
    .regex(/^(\d+):([0-5]?\d):([0-5]?\d)$/, {
      message: 'Invalid video duration format. Use HH:MM:SS'
    })
    .refine((val) => {
      const parts = val.split(':').map(Number);
      return parts[1] < 60 && parts[2] < 60;
    }, 'Minutes and seconds must be less than 60')
]),
course_reported_financial_year: z.union([z.null(), z.enum(financialYears)]),
quater: nonEmptyString,
sme_name: z.string().nullable(),
sme_institute: z.string().nullable(),
no_of_videos: z.coerce.number().nullable(),
course_status: z.union([z.null(), z.enum(courseStatuses)]),
language: z.union([z.null(), z.enum(languages)]),
course_category: z.union([z.null(), z.enum(courseCategories)]),
coordinating_institute: nonEmptyString,
admin_institute: nonEmptyString
})
.superRefine((data, ctx) => {
  if (data.course_name && data.course_name.toLowerCase() === 'other') {
    if (!data.coursename_others || data.coursename_others.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Course name (others) is required when 'Other' is selected and cannot be empty",
        path: ['coursename_others']
      });
    }
  }
  if (data.discipline && data.discipline.toLowerCase() === 'other') {
    if (!data.discipline_others || data.discipline_others.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Discipline (others) is required when 'Other' is selected and cannot be empty",
        path: ['discipline_others']
      });
    }
  }
});

export const nullFormEntry = {
chennal_no: null,
course_name: null,
coursename_others: null,
discipline: null,
discipline_others: null,
total_duration: null,
course_reported_financial_year: null,
quater: '',
sme_name: null,
sme_institute: null,
no_of_videos: null,
course_status: null,
language: null,
course_category: null,
coordinating_institute: '',
admin_institute: ''
} as const;

export const formSchema2 = z.object({
entries: z
.array(formEntrySchema)
.min(1, 'At least one entry is required')
.default([nullFormEntry])
});

export type FormSchema2 = typeof formSchema2;
export type FormSchema = typeof formSchema;
export type FormEntrySchema = typeof formEntrySchema;
