import { z } from 'zod';

export const formSchema = z.object({
	urls: z
		.array(z.string().url({ message: 'Please enter a valid URL.' }))
		.min(2, 'You must include at least two URLs on your profile.')
		.default(['', ''])
});

export type FormSchema = typeof formSchema;
