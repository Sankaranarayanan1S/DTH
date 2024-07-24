<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { course_name } from './course_name';
	import { discipline } from './discipline';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema2, type FormSchema2 } from './schema';

	export let institute: string;
	export let quater: string;
	export let dataform: SuperValidated<Infer<FormSchema2>>;
	const form = superForm(dataform, {
		validators: zodClient(formSchema2)
	});

	const { form: formData, enhance } = form;

	function addEntry() {
		$formData.entries = [
			...$formData.entries,
			{
				chennal_no: '',
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
				coordinating_institute: '',
				admin_institute:''
			}
		];
	}

	function removeEntry(index: number) {
		$formData.entries = $formData.entries.filter((_, i) => i !== index);
	}

	let Channelno = {
		CEC: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '40'],
		IGNOU: ['11', '12', '13', '14', '15', '16'],
		'IIT Bombay': ['17', '18', '19', '20'],
		'IIT Delhi': ['21', '22'],
		'IIT Gandhinagar': ['23'],
		'IIT Kanpur': ['24', '25', '26', '27', '28'],
		'IIT Kharagpur': ['29', '30'],
		'IIT Madras': ['31', '32', '33', '34', '35', '36'],
		'IIT Tirupati': ['37', '38'],
		'University of Hyderabad': ['39']
	};

	let data: string[] = [];
	let courseName: string[] = [];
	let showCustomCourseName = false;
	let showCustomDisciplineName = false;
	let isLoading = true;
	let isMatchingPattern = true;
	let q1CourseNum = [1];

	onMount(async () => {
		data = Channelno[institute as keyof typeof Channelno];
		courseName = course_name[institute];
		isLoading = false;
	});
</script>

<form method="POST" use:enhance>
	<Card.Root>
		<Card.Header>
			<Card.Title>Enter the course details for Q1(April - June)</Card.Title>
		</Card.Header>
		{#each $formData.entries as obj, index}
			<!-- <form class="main_form"> -->
			<Card.Content
				class="ml-4 mr-4 mt-4 flex border-spacing-[7px] flex-wrap items-center gap-6 space-y-2 rounded-md border-2 border-green-700 pt-4"
			>
				<div class="space-y-1">
					<Label for="ch_no">Channel Number</Label>
					<Select.Root name="select">
						<Select.Trigger class="min-w-[180px]">
							<Select.Value placeholder="Channel Number" />
						</Select.Trigger>
						<Select.Content class="scrollbar-hide max-h-[300px] !w-fit overflow-y-auto">
							<!-- <SelectGroup> -->
							<Select.Label>Channel Number</Select.Label>
							{#if isLoading}
								<Select.Item value="">loading...</Select.Item>
							{:else}
								{#each data as d}
									<Select.Item value={d}>{d}</Select.Item>
								{/each}
							{/if}
							<!-- </SelectGroup> -->
						</Select.Content>
						<Select.Input name="chennal_no" />
					</Select.Root>
				</div>

				<div class="space-y-1">
					<Label for="course_name">Course Name</Label>
					<span class="text-red-700"> *</span>
					<Select.Root
						name="course_name"
						onSelectedChange={(v) => {
							v && v.value === 'other'
								? (showCustomCourseName = true)
								: (showCustomCourseName = false);
						}}
					>
						<Select.Trigger class="min-w-[180px]">
							<Select.Value placeholder="course_name" />
						</Select.Trigger>
						<Select.Content class="scrollbar-hide max-h-[300px] !w-fit overflow-y-auto">
							<Select.Group>
								<Select.Label>Course Name</Select.Label>
								{#if isLoading}
									<Select.Item value="">loading...</Select.Item>
								{:else}
									{#each courseName as d}
										<Select.Item value={d}>{d}</Select.Item>
									{/each}
									<!-- <Select.Item value="other">Other</Select.Item> -->
								{/if}
							</Select.Group>
						</Select.Content>
						<Select.Input name="course_name" />
					</Select.Root>
				</div>

				{#if showCustomCourseName}
					<div class="space-y-1">
						<Label for="custom_course_name">Additional Course name</Label>
						<span class="text-red-700"> *</span>
						<Input id="custom_course_name" name="custom_course_name" type="text" required />
					</div>
				{/if}

				<div class="space-y-1">
					<Label for="discipline">Discipline</Label>
					<span class="text-red-700"> *</span>
					<Select.Root
						name="discipline"
						onSelectedChange={(v) => v && v.value === 'other' && (showCustomDisciplineName = true)}
					>
						<Select.Trigger class="min-w-[180px]">
							<Select.Value placeholder="Select" />
						</Select.Trigger>
						<Select.Content class="scrollbar-hide max-h-[300px] !w-fit overflow-y-auto">
							<Select.Group>
								{#if isLoading}
									<Select.Item value="">loading...</Select.Item>
								{:else}
									{#each discipline as d}
										<Select.Item value={d}>{d}</Select.Item>
									{/each}
								{/if}
							</Select.Group>
						</Select.Content>
						<Select.Input name="discipline" />
					</Select.Root>
				</div>

				{#if showCustomDisciplineName}
					<div class="space-y-1">
						<Label for="custom_discipline">Custom Discipline</Label>
						<span class="text-red-700"> *</span>
						<Input id="custom_discipline" type="text" name="custom_discipline" required />
					</div>
				{/if}

				<div class="space-y-1">
					<Label for="language">Select Language</Label>
					<span class="text-red-700"> *</span>
					<Select.Root name="language">
						<Select.Trigger class="min-w-[180px]">
							<Select.Value placeholder="Select" />
						</Select.Trigger>
						<Select.Content class="scrollbar-hide max-h-[300px] !w-fit overflow-y-auto">
							<!-- <Select.Group> -->
							<Select.Item class="pr-6" value="Assamese">Assamese</Select.Item>
							<Select.Item class="pr-6" value="Bengali">Bengali</Select.Item>
							<Select.Item class="pr-6" value="English">English</Select.Item>
							<Select.Item class="pr-6" value="Gujarati">Gujarati</Select.Item>
							<Select.Item class="pr-6" value="Hindi">Hindi</Select.Item>
							<Select.Item class="pr-6" value="Kannada">Kannada</Select.Item>
							<Select.Item class="pr-6" value="Kashmiri">Kashmiri</Select.Item>
							<Select.Item class="pr-6" value="Malayalam">Malayalam</Select.Item>
							<Select.Item class="pr-6" value="Marathi">Marathi</Select.Item>
							<Select.Item class="pr-6" value="Punjabi">Punjabi</Select.Item>
							<Select.Item class="pr-6" value="Sanskrit">Sanskrit</Select.Item>
							<Select.Item class="pr-6" value="Tamil">Tamil</Select.Item>
							<Select.Item class="pr-6" value="Telugu">Telugu</Select.Item>
							<Select.Item class="pr-6" value="Urdu">Urdu</Select.Item>
							<!-- </Select.Group> -->
						</Select.Content>
						<Select.Input name="language" />
					</Select.Root>
				</div>

				<div class="space-y-1">
					<Label for="sme_name">SME Name</Label>
					<span class="text-red-700"> *</span>
					<Input id="sme_name" type="text" name="sme_name" />
				</div>

				<div class="space-y-1">
					<Label for="sme_institute">SME Institute</Label>
					<span class="text-red-700"> *</span>
					<Input id="sme_institute" type="text" name="sme_institute" />
				</div>

				<div class="space-y-1">
					<Label for="no_of_videos">No of Session Recorded</Label>
					<span class="text-red-700"> *</span>
					<Input id="no_of_videos" type="text" name="no_of_videos" />
				</div>

				<div class="space-y-1">
					<Label for="duration">Total Duration</Label>
					<span class="text-red-700"> *</span>
					<Input
						type="text"
						class="appearance-none"
						placeholder="HH:MM:SS"
						id="duration"
						name="duration"
						pattern="(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)"
					/>
					{#if !isMatchingPattern}
						<span class="mx-auto mt-2 inline-block w-fit text-[11px] text-red-700"
							>Format should be HH:MM:SS</span
						>
					{/if}
				</div>

				<div class="space-y-1">
					<Label for="course_status">Course Status</Label>
					<span class="text-red-700"> *</span>
					<Select.Root name="course_status">
						<Select.Trigger class="min-w-[180px]">
							<Select.Value placeholder="Select" />
						</Select.Trigger>
						<Select.Content>
							<!-- <Select.Group> -->
							<Select.Item value="Completed">Completed</Select.Item>
							<Select.Item value="Ongoing">Ongoing</Select.Item>
							<!-- </Select.Group> -->
						</Select.Content>
						<Select.Input name="course_status" />
					</Select.Root>
				</div>

				<div class="space-y-1">
					<Label for="course_category">Course category</Label>
					<span class="text-red-700"> *</span>
					<Select.Root name="course_category">
						<Select.Trigger class="min-w-[180px]">
							<Select.Value placeholder="Select" />
						</Select.Trigger>
						<Select.Content>
							<!-- <Select.Group> -->
							<Select.Item value="Studio based_recording">Studio based recording</Select.Item>
							<Select.Item value="Live sessions">Live Sessions</Select.Item>
							<Select.Item value="Conferences">Conferences</Select.Item>
							<Select.Item value="Workshops">Workshops</Select.Item>
							<Select.Item value="special series">Special Series</Select.Item>
							<!-- </Select.Group> -->
						</Select.Content>
						<Select.Input name="course_category" />
					</Select.Root>
				</div>

				<div class="space-y-1">
					<Label for="course_reported">Is the course reported on the previous financial year?</Label
					>
					<span class="text-red-700"> *</span>
					<Select.Root name="course_reported">
						<Select.Trigger class="min-w-[180px]">
							<Select.Value placeholder="Select" />
						</Select.Trigger>
						<Select.Content>
							<!-- <Select.Group> -->
							<Select.Item value="Yes">Yes</Select.Item>
							<Select.Item value="No">No</Select.Item>
							<!-- </Select.Group> -->
						</Select.Content>
						<Select.Input name="course_reported_financial_year" />
					</Select.Root>
				</div>

				<Input id="quater" name="quater" type="hidden" value={quater} />
				<Input
					id="coordinating_institute"
					name="coordinating_institute"
					type="hidden"
					value={institute}
				/>
			</Card.Content>
		{/each}

		<br />
		<div class="flex">
			<Button type="button" class="mb-6 ml-6" on:click={addEntry}>Add Course</Button>
			<Button type="button" class="mb-6 ml-6" on:click={removeEntry}>Remove Course</Button>
		</div>
		<Card.Footer>
			<Button type="submit">Submit</Button>
			&nbsp;&nbsp;
			<Button>
				<a href="/preview" target="_blank"> Click here to view the course list </a>
			</Button>
		</Card.Footer>
	</Card.Root>
</form>
