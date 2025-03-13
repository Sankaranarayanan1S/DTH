<script lang="ts">
import { onMount } from 'svelte';
import * as Card from '$lib/components/ui/card';
import { Input } from '$lib/components/ui/input';
import * as Select from '$lib/components/ui/select';
import * as Form from '$lib/components/ui/form';
import { Button } from '$lib/components/ui/button';
import { course_name } from './course_name';
import { discipline } from './discipline';
import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';
import { formSchema2, type FormSchema2, nullFormEntry } from './schema';
import { fade } from 'svelte/transition';

let showSuccessMessage = false;

export let institute: string;
export let admin_institute: string;
export let quater: string;
export let dataform: SuperValidated<Infer<FormSchema2>>;

let hasContent = true;
type FormValue = string | null;
type FormSelectEvent = { value: FormValue; label: string | null };

	const form = superForm(dataform, {
	validators: zodClient(formSchema2),
	dataType: 'json',
	resetForm: true,
	onSubmit(input) {
	  if (!hasContent) {
	    $formData.entries = [{
	      chennal_no: null,
	      course_name: null,
	      coursename_others: null,
	      discipline: null,
	      discipline_others: null,
	      total_duration: null,
	      course_reported_financial_year: null,
	      quater: quater,
	      sme_name: null,
	      sme_institute: null,
	      no_of_videos: null,
	      course_status: null,
	      language: null,
	      course_category: null,
	      coordinating_institute: institute,
	      admin_institute: admin_institute
	    }];
	  } else {
	    for (let index = 0; index < $formData.entries.length; index++) {
	      $formData.entries[index].quater = quater;
	      $formData.entries[index].coordinating_institute = institute;
	      $formData.entries[index].admin_institute = admin_institute;
	    }
	  }
	  console.log('input:::::', JSON.stringify(input));
	},
	onResult({ result }) {
	  if (result.type === 'success') {
	    showSuccessMessage = true;
	    setTimeout(() => {
	      showSuccessMessage = false;
	    }, 3000);
	  }
	}
	});
	const { form: formData, errors, enhance } = form;
	function addEntry() {
	$formData.entries = [
	  ...$formData.entries,
	  {
	    ...nullFormEntry,
	    quater,
	    coordinating_institute: institute,
	    admin_institute
	  }
	];
	}

	function removeEntry(index: number) {
		$formData.entries = $formData.entries.filter((_, i) => i !== index);
	}

	let institute_wise_channels = {
		CEC: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '40','Cross Content'],
		CEC1: ['1','Cross Content'],
		CEC2: ['2','Cross Content'],
		CEC3: ['3','Cross Content'],
		CEC4: ['4','Cross Content'],
		CEC5: ['5','Cross Content'],
		CEC6: ['6','Cross Content'],
		CEC7: ['7','Cross Content'],
		CEC8: ['8','Cross Content'],
		CEC9: ['9','Cross Content'],
		CEC10: ['10','Cross Content'],
		CEC40: ['40','Cross Content'],

		IGNOU: ['11', '12', '13', '14', '15', '16','Cross Content'],
		IGNOU11: ['11','Cross Content'],
		IGNOU12: ['12','Cross Content'],

		IGNOU13: ['13','Cross Content'],

		IGNOU14: ['14','Cross Content'],

		IGNOU15: ['15','Cross Content'],

		IGNOU16: [ '16','Cross Content'],



		'IIT Bombay': ['17', '18', '19', '20','Cross Content'],
		'IIT Delhi': ['21', '22','Cross Content'],
		'IIT Gandhinagar': ['23','Cross Content'],
		'IIT Kanpur': ['24', '25', '26', '27', '28','Cross Content'],
		'IIT Kharagpur': ['29', '30'],
		'IIT Madras': ['31', '32', '33', '34', '35', '36','Cross Content'],
		'IIT Tirupati': ['37', '38','Cross Content'],
		'University of Hyderabad': ['39','Cross Content']
	};

	let channel_nos: string[] = [];
	let courseName: string[] = [];
	let showCustomCourseName = false;
	let showCustomDisciplineName = false;
	let isLoading = true;

	onMount(async () => {
		channel_nos = institute_wise_channels[institute as keyof typeof institute_wise_channels];
		courseName = course_name[institute as keyof typeof course_name];
		isLoading = false;
	});
	function handleWheel(event: WheelEvent) {
		if (event.target instanceof HTMLElement) {
			event.target.blur();
		}
	}
</script>

<form method="POST" action="?/qcard" use:enhance>
{#if showSuccessMessage}
<div
  transition:fade={{ duration: 200 }}
  class="fixed right-4 top-4 z-50 rounded-md bg-green-500 p-4 text-white shadow-lg">
  <span class="font-semibold">Success!</span>
  <p>Form submitted successfully</p>
</div>
{/if}
<Card.Root>
<Card.Header>
<div class="flex items-center justify-between">
<Card.Title>Enter the course details for {quater.toUpperCase()}</Card.Title>
<div class="flex items-center gap-2">
<Select.Root
  selected={{ value: hasContent ? "yes" : "no", label: hasContent ? "Has content" : "No course content" }}
  onSelectedChange={(s) => {
    hasContent = s?.value === "yes";
    if (!hasContent) {
      $formData.entries = [{
        ...nullFormEntry,
        quater,
        coordinating_institute: institute,
        admin_institute
      }];
    }
  }}
>
  <Select.Trigger class="w-[180px]">
    <Select.Value placeholder="Select Content Status" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="yes">Has content</Select.Item>
    <Select.Item value="no">No course content</Select.Item>
  </Select.Content>
</Select.Root>
</div>
</div>
</Card.Header>

{#if hasContent}
		{#each $formData.entries as entry, index}
			<Card.Content
				class="ml-4 mr-4 mt-4 flex flex-wrap items-end gap-6 space-y-2 rounded-md border-2 border-green-700 pt-4"
			>
				<Form.Field {form} name="entries[{index}].chennal_no">
					<Form.Control let:attrs>
						<Form.Label>Channel No</Form.Label>
						<span class="text-red-700"> *</span>
						<Select.Root
						selected={{ value: entry.chennal_no ?? "", label: entry.chennal_no ?? "Select a channel" }}
						onSelectedChange={(s) => {
						  $formData.entries[index].chennal_no = s?.value ?? null;
						}}
						>
						<Select.Input name={attrs.name} />
						<Select.Trigger {...attrs} class="w-[180px]">
						<Select.Value placeholder="Select a channel" />
						</Select.Trigger>
						<Select.Content class="scrollbar-hide max-h-[300px] overflow-y-auto">
						{#each channel_nos as value}
						<Select.Item value={value}>{value}</Select.Item>
						{/each}
						</Select.Content>
						</Select.Root>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="entries[{index}].course_name">
					<Form.Control let:attrs>
						<Form.Label>Course Name</Form.Label>
						<span class="text-red-700"> *</span>
						<Select.Root
						selected={{
						  value: entry.course_name ?? null,
						  label: entry.course_name ?? "Select Course Name"
						}}
						onSelectedChange={(s) => {
						  $formData.entries[index].course_name = s?.value ?? null;
						  showCustomCourseName = s?.value?.toLowerCase() === 'other';
						}}
						>
							<Select.Input name={attrs.name} />
							<Select.Trigger {...attrs} class="w-[180px]">
								<Select.Value placeholder="Select Course Name" class="text-left" />
							</Select.Trigger>
							<Select.Content class="scrollbar-hide max-h-[300px] !w-fit overflow-y-auto">
								{#each courseName as value}
									<Select.Item {value}>{value}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				{#if showCustomCourseName}
					<Form.Field {form} name="entries[{index}].coursename_others">
						<Form.Control let:attrs>
							<Form.Label>Additional Course name</Form.Label>
							<span class="text-red-700"> *</span>
							<Input
								type="text"
								{...attrs}
								bind:value={$formData.entries[index].coursename_others}
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				{/if}

				<Form.Field {form} name="entries[{index}].discipline">
					<Form.Control let:attrs>
						<Form.Label>Discipline</Form.Label>
						<span class="text-red-700"> *</span>
						<Select.Root
						selected={{
						  value: entry.discipline ?? null,
						  label: entry.discipline ?? "Select Discipline"
						}}
						onSelectedChange={(s) => {
						  $formData.entries[index].discipline = s?.value ?? null;
						  showCustomDisciplineName = s?.value?.toLowerCase() === 'other';
						}}
						>
							<Select.Input name={attrs.name} />
							<Select.Trigger {...attrs} class="w-[180px]">
								<Select.Value placeholder="Select Discipline" class="text-left" />
							</Select.Trigger>
							<Select.Content class="scrollbar-hide max-h-[300px] !w-fit overflow-y-auto">
								{#each discipline as value}
									<Select.Item {value}>{value}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				{#if showCustomDisciplineName}
					<Form.Field {form} name="entries[{index}].discipline_others">
						<Form.Control let:attrs>
							<Form.Label>Custom Discipline</Form.Label>
							<span class="text-red-700"> *</span>
							<Input
								type="text"
								{...attrs}
								bind:value={$formData.entries[index].discipline_others}
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				{/if}

				<Form.Field {form} name="entries[{index}].language">
					<Form.Control let:attrs>
						<Form.Label>Language</Form.Label>
						<span class="text-red-700"> *</span>
						<Select.Root
							selected={{
							  value: entry.language ?? null,
							  label: entry.language ?? "Select Language"
							}}
							onSelectedChange={(s) => {
							  $formData.entries[index].language = s?.value ?? null;
							}}
						>
							<Select.Input name={attrs.name} />
							<Select.Trigger {...attrs} class="w-[180px]">
								<Select.Value placeholder="Select Language" />
							</Select.Trigger>
							<Select.Content class="scrollbar-hide max-h-[300px] overflow-y-auto">
								<Select.Item value="assamese">Assamese</Select.Item>
								<Select.Item value="bengali">Bengali</Select.Item>
								<Select.Item value="english">English</Select.Item>
								<Select.Item value="gujarati">Gujarati</Select.Item>
								<Select.Item value="hindi">Hindi</Select.Item>
								<Select.Item value="kannada">Kannada</Select.Item>
								<Select.Item value="kashmiri">Kashmiri</Select.Item>
								<Select.Item value="malayalam">Malayalam</Select.Item>
								<Select.Item value="marathi">Marathi</Select.Item>
								<Select.Item value="punjabi">Punjabi</Select.Item>
								<Select.Item value="sanskrit">Sanskrit</Select.Item>
								<Select.Item value="tamil">Tamil</Select.Item>
								<Select.Item value="telugu">Telugu</Select.Item>
								<Select.Item value="urdu">Urdu</Select.Item>
							</Select.Content>
						</Select.Root>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="entries[{index}].sme_name">
					<Form.Control let:attrs>
						<Form.Label>SME Name</Form.Label>
						<span class="text-red-700"> *</span>
						<Input type="text" {...attrs} bind:value={$formData.entries[index].sme_name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="entries[{index}].sme_institute">
					<Form.Control let:attrs>
						<Form.Label>SME Institute</Form.Label>
						<span class="text-red-700"> *</span>
						<Input type="text" {...attrs} bind:value={$formData.entries[index].sme_institute} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="entries[{index}].no_of_videos">
					<Form.Control let:attrs>
						<Form.Label>No of Session Recorded</Form.Label>
						<span class="text-red-700"> *</span>
						<Input
							type="number"
							on:wheel={handleWheel}
							{...attrs}
							bind:value={$formData.entries[index].no_of_videos}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="entries[{index}].total_duration">
					<Form.Control let:attrs>
						<Form.Label>Total Duration</Form.Label>
						<span class="text-red-700"> *</span>
						<Input
							type="text"
							placeholder="HH:MM:SS"
							{...attrs}
							bind:value={$formData.entries[index].total_duration}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<!--  on:change={(e) => {
								console.log('input:::::', e?.target?.value);
								$formData.entries[index].total_duration = e?.target?.value;
							}}
							value={$formData.entries[index].total_duration}-->
				<Form.Field {form} name="entries[{index}].course_status">
					<Form.Control let:attrs>
						<Form.Label>Course Status</Form.Label>
						<span class="text-red-700"> *</span>
						<Select.Root
						selected={{
						  value: entry.course_status ?? null,
						  label: entry.course_status ?? "Select Course Status"
						}}
						onSelectedChange={(s) => {
						  $formData.entries[index].course_status = s?.value ?? null;
						}}
						>
							<Select.Input name={attrs.name} />
							<Select.Trigger {...attrs} class="w-[180px]">
								<Select.Value placeholder="Select Course Status" />
							</Select.Trigger>
							<Select.Content class="scrollbar-hide max-h-[300px] overflow-y-auto">
								<Select.Item value="completed">Completed</Select.Item>
								<Select.Item value="ongoing">Ongoing</Select.Item>
							</Select.Content>
						</Select.Root>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="entries[{index}].course_category">
					<Form.Control let:attrs>
						<Form.Label>Course Category</Form.Label>
						<span class="text-red-700"> *</span>
						<Select.Root
						selected={{
						  value: entry.course_category ?? null,
						  label: entry.course_category ?? "Select Category"
						}}
						onSelectedChange={(s) => {
						  $formData.entries[index].course_category = s?.value ?? null;
						}}
						>
							<Select.Input name={attrs.name} />
							<Select.Trigger {...attrs} class="w-[180px]">
								<Select.Value placeholder="Select Category" class="text-left" />
							</Select.Trigger>
							<Select.Content class="scrollbar-hide max-h-[300px] overflow-y-auto">
								<Select.Item value="studio_based_recording">Studio based recording</Select.Item>
								<Select.Item value="live_sessions">Live Sessions</Select.Item>
								<Select.Item value="conferences">Conferences</Select.Item>
								<Select.Item value="workshops">Workshops</Select.Item>
								<Select.Item value="special_series">Special Series</Select.Item>
							</Select.Content>
						</Select.Root>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="entries[{index}].course_reported_financial_year">
					<Form.Control let:attrs>
						<Form.Label>Is the course reported on the previous financial year?</Form.Label>
						<span class="text-red-700"> *</span>
						<Select.Root
						selected={{
						  value: entry.course_reported_financial_year ?? null,
						  label: entry.course_reported_financial_year ?? "Select Option"
						}}
						onSelectedChange={(s) => {
						  $formData.entries[index].course_reported_financial_year = s?.value ?? null;
						}}
						>
							<Select.Input name={attrs.name} />
							<Select.Trigger {...attrs} class="w-[180px]">
								<Select.Value placeholder="Select Category" class="text-left" />
							</Select.Trigger>
							<Select.Content class="scrollbar-hide max-h-[300px] overflow-y-auto">
								<Select.Item value="yes">Yes</Select.Item>
								<Select.Item value="no">No</Select.Item>
							</Select.Content>
						</Select.Root>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<!-- <Form.Field {form} name="entries[{index}].quater">
					<Form.Control let:attrs>
						<Form.Label>Quater</Form.Label>
						<span class="text-red-700"> *</span>
						<Input type="text" {...attrs} bind:value={$formData.entries[index].quater} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field> -->
				<!-- <Input name="quater" type="hidden" value={quater} /> -->
				<!-- {($formData.entries[index].quater = quater)} -->
				<!-- <Form.Field {form} name="entries[{index}].coordinating_institute">
					<Form.Control let:attrs>
						<Form.Label>Institute</Form.Label>
						<span class="text-red-700"> *</span>
						<Input
							type="text"
							{...attrs}
							bind:value={$formData.entries[index].coordinating_institute}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field> -->
				<!-- <Input name="coordinating_institute" type="hidden" value={institute} /> -->
				<!-- {($formData.entries[index].coordinating_institute = institute)} -->
				<Button type="button" class="ml-6" on:click={() => removeEntry(index)}>
					Remove Course
				</Button>
			</Card.Content>
		{/each}
		
		<br />
		<div class="flex">
		<Button type="button" class="mb-6 ml-6" on:click={addEntry}>Add Course</Button>
		</div>
		{/if}
		
		<Card.Footer>
		<Button type="submit">Submit</Button>
		&nbsp;&nbsp;
		<Button href="/preview" target="_blank">Click here to view the course list</Button>
		</Card.Footer>
		</Card.Root>
		</form>
