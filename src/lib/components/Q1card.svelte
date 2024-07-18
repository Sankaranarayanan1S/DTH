<script>
	import { onMount } from 'svelte';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import {
		Select,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectLabel,
		SelectTrigger,
		SelectValue
	} from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	// import { course_name } from './course_name';

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

	let data = [];
	let courseName = [];
	let showCustomCourseName = false;
	let showCustomDisciplineName = false;
	let isLoading = true;
	let institute = '';
	let isMatchingPattern = true;
	let q1CourseNum = [1];

	onMount(async () => {
		const res = await fetch('/api/institute');
		const result = await res.json();
		institute = result.institute;
		data = Channelno[institute];
		courseName = course_name[institute];
		isLoading = false;
	});

	function handleSubmit() {
		const forms = document.getElementsByClassName('main_form');
		const financial_year = document.getElementById('financial_year');
		const formData = new FormData(financial_year);

		let check = [];
		Array.from(forms).forEach((element) => {
			let formObj = {};
			const formData = new FormData(element);
			formData.forEach((value, key) => (formObj[key] = value));
			const pattern = /^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/;
			if (!pattern.test(formObj.duration)) {
				isMatchingPattern = false;
				return;
			}
			check.push(formObj);
		});

		// Here you would typically send the data to the server
		console.log('Submitting data:', check);

		// Reset forms
		Array.from(forms).forEach((element) => {
			element.reset();
		});

		// Refresh page (you might want to handle this differently in Svelte)
		location.reload();
	}

	function addCourse() {
		q1CourseNum = [...q1CourseNum, q1CourseNum.length + 1];
	}

	function removeCourse() {
		if (q1CourseNum.length > 1) {
			q1CourseNum = q1CourseNum.slice(0, -1);
		}
	}
</script>

<Card>
	<CardHeader>
		<CardTitle>Enter the course details for Q1(April - June)</CardTitle>
	</CardHeader>
	<!-- <form method="POST" use:enhance> -->
	{#each q1CourseNum as num, index}
		<form class="main_form">
			<CardContent
				class="ml-4 mr-4 mt-4 flex border-spacing-[7px] flex-wrap items-center gap-6 space-y-2 rounded-md border-2 border-green-700 pt-4"
			>
				<div class="space-y-1">
					<Label for="ch_no">Channel Number</Label>
					<Select name="select" defaultValue="select">
						<SelectTrigger class="w-[180px]">
							<SelectValue placeholder="Channel Number" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Channel Number</SelectLabel>
								{#if isLoading}
									<SelectItem value="">loading...</SelectItem>
								{:else}
									{#each data as d}
										<SelectItem value={d}>{d}</SelectItem>
									{/each}
								{/if}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				<div class="space-y-1">
					<Label for="course_name">Course Name</Label>
					<span class="text-red-700"> *</span>
					<Select
						name="course_name"
						defaultValue="select"
						on:change={(e) => (showCustomCourseName = e.target.value === 'other')}
					>
						<SelectTrigger class="w-[180px]">
							<SelectValue placeholder="course_name" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Course Name</SelectLabel>
								{#if isLoading}
									<SelectItem value="">loading...</SelectItem>
								{:else}
									{#each courseName as d}
										<SelectItem value={d}>{d}</SelectItem>
									{/each}
									<SelectItem value="other">Other</SelectItem>
								{/if}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				{#if showCustomCourseName}
					<div class="space-y-1">
						<Label for="custom_course_name">Non approved course Name</Label>
						<span class="text-red-700"> *</span>
						<Input id="custom_course_name" name="custom_course_name" type="text" required />
					</div>
				{/if}

				<div class="space-y-1">
					<Label for="discipline">Discipline</Label>
					<span class="text-red-700"> *</span>
					<Select
						name="discipline"
						on:change={(e) => (showCustomDisciplineName = e.target.value === 'other')}
					>
						<SelectTrigger class="w-[180px]">
							<SelectValue placeholder="Select" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="Aerospace Engineering">Aerospace Engineering</SelectItem>
								<SelectItem value="Agricultural and Food Engineering"
									>Agricultural and Food Engineering</SelectItem
								>
								<!-- ... (other discipline options) ... -->
								<SelectItem value="other">Other</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				{#if showCustomDisciplineName}
					<div class="space-y-1">
						<Label for="custom_discipline">Custom Discipline</Label>
						<Input id="custom_discipline" type="text" name="custom_discipline" required />
					</div>
				{/if}

				<div class="space-y-1">
					<Label for="language">Select Language</Label>
					<span class="text-red-700"> *</span>
					<Select name="language">
						<SelectTrigger class="w-[180px]">
							<SelectValue placeholder="Select" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="Assamese">Assamese</SelectItem>
								<SelectItem value="Bengali">Bengali</SelectItem>
								<SelectItem value="English">English</SelectItem>
								<!-- ... (other language options) ... -->
							</SelectGroup>
						</SelectContent>
					</Select>
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
					<Select name="course_status">
						<SelectTrigger class="w-[180px]">
							<SelectValue placeholder="Select" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="Completed">Completed</SelectItem>
								<SelectItem value="Ongoing">Ongoing</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				<div class="space-y-1">
					<Label for="course_category">Course category</Label>
					<span class="text-red-700"> *</span>
					<Select name="course_category">
						<SelectTrigger class="w-[180px]">
							<SelectValue placeholder="Select" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="Studio based_recording">Studio based recording</SelectItem>
								<SelectItem value="Live sessions">Live Sessions</SelectItem>
								<SelectItem value="Conferences">Conferences</SelectItem>
								<SelectItem value="Workshops">Workshops</SelectItem>
								<SelectItem value="special series">Special Series</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				<div class="space-y-1">
					<Label for="course_reported">Is the course reported on the previous financial year?</Label
					>
					<span class="text-red-700"> *</span>
					<Select name="course_reported">
						<SelectTrigger class="w-[180px]">
							<SelectValue placeholder="Select" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="Yes">Yes</SelectItem>
								<SelectItem value="No">No</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				<Input id="quater" name="quater" type="hidden" value="q1" />
				<Input
					id="coordinating_institute"
					name="coordinating_institute"
					type="hidden"
					value={institute}
				/>
			</CardContent>
		</form>
	{/each}

	<br />
	<div class="flex">
		<Button type="button" class="mb-6 ml-6" on:click={addCourse}>Add Course</Button>
		<Button type="button" class="mb-6 ml-6" on:click={removeCourse}>Remove Course</Button>
	</div>
	<CardFooter>
		<Button on:click={handleSubmit}>Submit</Button>
		&nbsp;&nbsp;
		<Button>
			<a href="http://localhost:3000/preview" target="_blank">
				Click here to view the course list
			</a>
		</Button>
	</CardFooter>
</Card>
