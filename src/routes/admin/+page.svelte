<script lang="ts">
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import {
		addPagination,
		addSortBy,
		addTableFilter,
		addHiddenColumns,
		addSelectedRows
	} from 'svelte-headless-table/plugins';
	import * as Select from '$lib/components/ui/select';
	import { readable, type Writable } from 'svelte/store';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import * as Table from '$lib/components/ui/table';
	import DataTableActions from './data-table-actions.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import { onMount } from 'svelte';
	import { Pencil } from 'lucide-svelte';
	import EditButton from './editButton.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import {
		formEntrySchema,
		formSchema2,
		type FormSchema2,
		type FormEntrySchema
	} from '$lib/components/schema';
	import { course_name } from '$lib/components/course_name';
	import { discipline } from '$lib/components/discipline';
	import { writable } from 'svelte/store';
	import { invalidateAll } from '$app/navigation';

	export let data;

	// import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';

	// import { mkConfig, generateCsv, download } from 'export-to-csv';

	// import Table from '$lib/components/ui/table';
	// import TableBody from '$lib/components/ui/table-body';
	// import TableCell from '$lib/components/ui/table-cell';
	// import TableHead from '$lib/components/ui/table-head';
	// import TableHeader from '$lib/components/ui/table-header';
	// import TableRow from '$lib/components/ui/table-row';

	// let data = [];
	// let isLoading = true;

	// const csvConfig = mkConfig({
	// 	fieldSeparator: ',',
	// 	filename: 'preview',
	// 	decimalSeparator: '.',
	// 	useKeysAsHeaders: true
	// });

	// const exportExcel = (rows) => {
	// 	const rowData = rows.map((row) => row.original);
	// 	const csv = generateCsv(csvConfig)(rowData);
	// 	download(csvConfig)(csv);
	// };

	// const columns = [
	// 	{
	// 		accessorKey: 'year',
	// 		header: ({ column }) => {
	// 			return `
	//         <Button variant="ghost" on:click={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
	//           Financial Year
	//           <CaretSortIcon class="ml-2 h-4 w-4" />
	//         </Button>
	//       `;
	// 		},
	// 		cell: ({ row }) => `<div>${row.getValue('year')}</div>`
	// 	}
	// 	// ... (other columns follow the same pattern)
	// ];

	// const table = createTable({
	// 	data,
	// 	columns,
	// 	getCoreRowModel: getCoreRowModel(),
	// 	getPaginationRowModel: getPaginationRowModel(),
	// 	getSortedRowModel: getSortedRowModel(),
	// 	getFilteredRowModel: getFilteredRowModel()
	// });
	// onMount(async () => {
	// 	const res = await fetch('/api/preview');
	// 	data = await res.json();
	// 	isLoading = false;
	// 	table.setData(data);
	// });

	export const isDialogOpen = writable(false);
	// export const formData: Writable<FormEntrySchema> = writable({});
	type Payment = {
		id: string;
		amount: number;
		status: 'pending' | 'processing' | 'success' | 'failed';
		email: string;
	};

	let institute_wise_channels = {
		CEC: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '40', 'Cross Content'],
		IGNOU: ['11', '12', '13', '14', '15', '16', 'Cross Content'],
		'IIT Bombay': ['17', '18', '19', '20', 'Cross Content'],
		'IIT Delhi': ['21', '22', 'Cross Content'],
		'IIT Gandhinagar': ['23', 'Cross Content'],
		'IIT Kanpur': ['24', '25', '26', '27', '28', 'Cross Content'],
		'IIT Kharagpur': ['29', '30', 'Cross Content'],
		'IIT Madras': ['31', '32', '33', '34', '35', '36', 'Cross Content'],
		'IIT Tirupati': ['37', '38', 'Cross Content'],
		'University of Hyderabad': ['39', 'Cross Content']
	};

	// export let institute: string;
	// export let quater: string;
	// export let dataform: SuperValidated<Infer<FormEntrySchema>>;

	let channel_nos: string[] = [];
	let courseName: string[] = [];
	let showCustomCourseName = false;
	let showCustomDisciplineName = false;

	const form = superForm(data.form2, {
		validators: zodClient(formEntrySchema),
		dataType: 'json',
		onSubmit(input) {
			// $formData.quater = $formData.quater;
			// $formData.coordinating_institute = $formData.coordinating_institute;
			// $formData.sme_institute = $formData.sme_institute;
			// $formData.sme_name = $formData.sme_name;
			// $formData.no_of_videos = $formData.no_of_videos;
			// $formData.total_duration = $formData.total_duration;
			// $formData.id = $formData.id;
			// $formData.coursename_others = $formData.coursename_others;
			// $formData.discipline_others = $formData.discipline_others;
			$formData.admin_institute = 'dummy data';
			delete $formData.year;
			console.log('input:::::', JSON.stringify($formData, null, 2));
		},
		onUpdated(event) {
			isDialogOpen.set(false);
			// invalidateAll();
		}
	});
	const { form: formData, errors, enhance } = form;

	// const data: Payment[] = [
	// 	{
	// 		id: 'm5gr84i9',
	// 		amount: 316,
	// 		status: 'success',
	// 		email: 'ken99@yahoo.com'
	// 	},
	// 	{
	// 		id: 'a7xc9p2q',
	// 		amount: 154.5,
	// 		status: 'pending',
	// 		email: 'sarah.smith@gmail.com'
	// 	},
	// 	{
	// 		id: 'b3nv6m1r',
	// 		amount: 720.25,
	// 		status: 'processing',
	// 		email: 'john.doe@hotmail.com'
	// 	},
	// 	{
	// 		id: 'k2lp8o7t',
	// 		amount: 1000,
	// 		status: 'failed',
	// 		email: 'emily.jones@outlook.com'
	// 	},
	// 	{
	// 		id: 'f4wd5e6y',
	// 		amount: 50.75,
	// 		status: 'success',
	// 		email: 'michael.brown@company.com'
	// 	}
	// ];

	const table = createTable(readable(data.results), {
		page: addPagination(),
		sort: addSortBy({ disableMultiSort: true }),
		filter: addTableFilter({
			includeHiddenColumns: true,
			fn: ({ filterValue, value }) => value.includes(filterValue)
		}),
		hide: addHiddenColumns(),
		select: addSelectedRows()
	});

	const columns = table.createColumns([
		// table.column({
		// 	accessor: 'id',
		// 	header: (_, { pluginStates }) => {
		// 		const { allPageRowsSelected } = pluginStates.select;
		// 		return createRender(DataTableCheckbox, {
		// 			checked: allPageRowsSelected
		// 		});
		// 	},
		// 	cell: ({ row }, { pluginStates }) => {
		// 		const { getRowState } = pluginStates.select;
		// 		const { isSelected } = getRowState(row);

		// 		return createRender(DataTableCheckbox, {
		// 			checked: isSelected
		// 		});
		// 	},
		// 	plugins: {
		// 		sort: {
		// 			disable: true
		// 		},
		// 		filter: {
		// 			exclude: true
		// 		}
		// 	}
		// }),
		table.column({
			accessor: 'id',
			header: 'Edit',
			cell: ({ row }) => {
				return createRender(EditButton, {
					isDialogOpen,
					row: row.original,
					formData
				});
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'year',
			header: 'Financial Year'
			// plugins: {
			// 	sort: {
			// 		disable: true
			// 	},
			// 	filter: {
			// 		exclude: true
			// 	}
			// }
		}),
		table.column({
			accessor: 'quater',
			header: 'quarter'
		}),
		table.column({
			accessor: 'chennal_no',
			header: 'Channel Number'
			// cell: ({ value }) => {
			// 	const formatted = new Intl.NumberFormat('en-US', {
			// 		style: 'currency',
			// 		currency: 'USD'
			// 	}).format(value);
			// 	return formatted;
			// }
			// plugins: {
			// 	sort: {
			// 		disable: true
			// 	},
			// 	filter: {
			// 		exclude: true
			// 	}
			// }
		}),
		// table.column({
		// 	accessor: ({ id }) => id,
		// 	header: '',
		// 	cell: ({ value }) => {
		// 		return createRender(DataTableActions, { id: value });
		// 	},
		// 	plugins: {
		// 		sort: {
		// 			disable: true
		// 		},
		// 		filter: {
		// 			exclude: true
		// 		}
		// 	}
		// })
		table.column({
			accessor: 'course_name',
			header: 'Course Name'
		}),
		table.column({
			accessor: 'coursename_others',
			header: 'Additional Course Name '
		}),
		table.column({
			accessor: 'language',
			header: 'Language'
		}),
		table.column({
			accessor: 'discipline',
			header: 'Discipline'
		}),
		table.column({
			accessor: 'sme_name',
			header: 'SME Name'
		}),
		table.column({
			accessor: 'sme_institute',
			header: 'SME Institute'
		}),
		table.column({
			accessor: 'no_of_videos',
			header: 'No of vidoes'
		}),
		table.column({
			accessor: 'total_duration',
			header: 'Total Duration'
		}),
		table.column({
			accessor: 'course_status',
			header: 'Course Status'
		}),
		table.column({
			accessor: 'course_category',
			header: 'course category'
		}),
		table.column({
			accessor: 'coordinating_institute',
			header: 'coordinating institute'
		}),
		table.column({
			accessor: 'course_reported_financial_year',
			header: 'Is the Course reported in the Financial Year?'
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns, rows } =
		table.createViewModel(columns);

	const { pageIndex, hasNextPage, hasPreviousPage } = pluginStates.page;
	const { filterValue } = pluginStates.filter;
	const { hiddenColumnIds } = pluginStates.hide;
	const { selectedDataIds } = pluginStates.select;

	const ids = flatColumns.map((col) => col.id);
	let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

	$: $hiddenColumnIds = Object.entries(hideForId)
		.filter(([, hide]) => !hide)
		.map(([id]) => id);

	const hidableCols = [
		'id',
		'year',
		'quater',
		'chennal_no',
		'course_name',
		'coursename_others',
		'discipline',
		'total_duration',
		'course_reported_financial_year',
		'sme_name',
		'sme_institute',
		'no_of_videos',
		'course_status',
		'language',
		'course_category',
		'coordinating_institute'
	];
	$: {
		channel_nos =
			institute_wise_channels[
				$formData.coordinating_institute as keyof typeof institute_wise_channels
			];
		courseName = course_name[$formData.coordinating_institute as keyof typeof course_name];
	}
	function handleWheel(event: WheelEvent) {
		if (event.target instanceof HTMLElement) {
			event.target.blur();
		}
	}
</script>

<!-- <SuperDebug data={$formData} /> -->
<main class="flex h-full min-h-dvh flex-col bg-orange-50">
	<div class="mx-auto my-12 w-11/12 rounded-2xl bg-white p-8 shadow-lg">
		<!-- {#if isLoading}
			<p>Loading...</p>
		{:else if !data}
			<p>No profile data</p>
		{:else} -->
		<!-- <Button
			class="mb-4"
			type="button"
			on:click={() => exportExcel(table.getFilteredRowModel().rows)}
		>
			Download CSV
		</Button>
		&nbsp; -->
		
		<!-- <Button>
			<a href="/">Home page</a>
		</Button> -->

		<div>
			<div class="flex items-center py-4">
				<Input
					class="max-w-sm"
					placeholder="Filter emails..."
					type="text"
					bind:value={$filterValue}
				/>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button variant="outline" class="ml-auto" builders={[builder]}>
							Columns <ChevronDown class="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						{#each flatColumns as col}
							{#if hidableCols.includes(col.id)}
								<DropdownMenu.CheckboxItem bind:checked={hideForId[col.id]}>
									{col.header}
								</DropdownMenu.CheckboxItem>
							{/if}
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
			<div class="rounded-md border">
				<Table.Root {...$tableAttrs}>
					<Table.Header>
						{#each $headerRows as headerRow}
							<Subscribe rowAttrs={headerRow.attrs()}>
								<Table.Row>
									{#each headerRow.cells as cell, i (cell.id)}
										<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
											<Table.Head {...attrs} class="[&:has([role=checkbox])]:pl-3">
												{#if cell.id === 'amount'}
													<div class="text-right">
														<Button variant="ghost" on:click={props.sort.toggle}>
															<Render of={cell.render()} />
															<ArrowUpDown class={'ml-2 h-4 w-4'} />
														</Button>
													</div>
												{:else if cell.id === 'email'}
													<Button variant="ghost" on:click={props.sort.toggle}>
														<Render of={cell.render()} />
														<ArrowUpDown class={'ml-2 h-4 w-4'} />
													</Button>
												{:else}
													<Render of={cell.render()} />
												{/if}
											</Table.Head>
										</Subscribe>
									{/each}
								</Table.Row>
							</Subscribe>
						{/each}
					</Table.Header>
					<Table.Body {...$tableBodyAttrs}>
						{#each $pageRows as row, i (row.id)}
							<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
								<Table.Row {...rowAttrs}>
									<!-- data-state={$selectedDataIds[row.id] && 'selected'} -->
									{#each row.cells as cell (cell.id)}
										<Subscribe attrs={cell.attrs()} let:attrs>
											<Table.Cell {...attrs} class="[&:has([role=checkbox])]:pl-3">
												{#if cell.id === 'amount'}
													<div class="text-right font-medium">
														<Render of={cell.render()} />
													</div>
												{:else if cell.id === 'status'}
													<div class="capitalize">
														<Render of={cell.render()} />
													</div>
												{:else}
													<Render of={cell.render()} />
												{/if}
											</Table.Cell>
										</Subscribe>
									{/each}
								</Table.Row>
							</Subscribe>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>

			<Dialog.Root bind:open={$isDialogOpen}>
				<Dialog.Content class="sm:max-w-[800px]">
					<Dialog.Header>
						<Dialog.Title>Edit Course Details</Dialog.Title>
						<Dialog.Description>
							Make changes to the course details here. Click save when you're done.
						</Dialog.Description>
					</Dialog.Header>
					<form method="POST" action="?/ucard" use:enhance class="flex flex-wrap items-end gap-4">
						<Form.Field {form} name="chennal_no">
							<Form.Control let:attrs>
								<Form.Label>Channel No</Form.Label>
								<span class="text-red-700"> *</span>
								<Select.Root
									selected={{ value: $formData.chennal_no, label: $formData.chennal_no }}
									onSelectedChange={(s) => {
										s && ($formData.chennal_no = s.value);
									}}
								>
									<Select.Input name={attrs.name} />
									<Select.Trigger {...attrs} class="w-[180px]">
										<Select.Value placeholder="Select a channel" />
									</Select.Trigger>
									<Select.Content class="scrollbar-hide max-h-[300px] overflow-y-auto">
										{#each channel_nos as value}
											<Select.Item {value}>{value}</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<Form.Field {form} name="course_name">
							<Form.Control let:attrs>
								<Form.Label>Course Name</Form.Label>
								<span class="text-red-700"> *</span>
								<Select.Root
									selected={{ value: $formData.course_name, label: $formData.course_name }}
									onSelectedChange={(s) => {
										s && ($formData.course_name = s.value);
										s && s.value.toLocaleLowerCase() === 'other'
											? (showCustomCourseName = true)
											: (showCustomCourseName = false);
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
							<Form.Field {form} name="coursename_others">
								<Form.Control let:attrs>
									<Form.Label>Additional Course Name</Form.Label>
									<span class="text-red-700"> *</span>
									<Input type="text" {...attrs} bind:value={$formData.coursename_others} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						{/if}

						<Form.Field {form} name="discipline">
							<Form.Control let:attrs>
								<Form.Label>Discipline</Form.Label>
								<span class="text-red-700"> *</span>
								<Select.Root
									selected={{ value: $formData.discipline, label: $formData.discipline }}
									onSelectedChange={(s) => {
										s && ($formData.discipline = s.value);
										s && s.value.toLocaleLowerCase() === 'other'
											? (showCustomDisciplineName = true)
											: (showCustomDisciplineName = false);
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
							<Form.Field {form} name="discipline_others">
								<Form.Control let:attrs>
									<Form.Label>Custom Discipline</Form.Label>
									<span class="text-red-700"> *</span>
									<Input type="text" {...attrs} bind:value={$formData.discipline_others} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						{/if}

						<Form.Field {form} name="language">
							<Form.Control let:attrs>
								<Form.Label>Language</Form.Label>
								<span class="text-red-700"> *</span>
								<Select.Root
									selected={{ value: $formData.language, label: $formData.language }}
									onSelectedChange={(s) => {
										s && ($formData.language = s.value);
									}}
								>
									<Select.Input name={attrs.name} />
									<Select.Trigger {...attrs} class="w-[180px]">
										<Select.Value placeholder="Select Language" />
									</Select.Trigger>
									<Select.Content class="scrollbar-hide max-h-[300px] overflow-y-auto">
										<Select.Item value="english">English</Select.Item>
										<Select.Item value="hindi">Hindi</Select.Item>
										<Select.Item value="spanish">Spanish</Select.Item>
									</Select.Content>
								</Select.Root>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="sme_name">
							<Form.Control let:attrs>
								<Form.Label>SME Name</Form.Label>
								<span class="text-red-700"> *</span>
								<Input type="text" {...attrs} bind:value={$formData.sme_name} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="sme_institute">
							<Form.Control let:attrs>
								<Form.Label>SME Institute</Form.Label>
								<span class="text-red-700"> *</span>
								<Input type="text" {...attrs} bind:value={$formData.sme_institute} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="no_of_videos">
							<Form.Control let:attrs>
								<Form.Label>No of Session Recorded</Form.Label>
								<span class="text-red-700"> *</span>
								<Input
									type="number"
									on:wheel={handleWheel}
									{...attrs}
									bind:value={$formData.no_of_videos}
								/>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="total_duration">
							<Form.Control let:attrs>
								<Form.Label>Total Duration</Form.Label>
								<span class="text-red-700"> *</span>
								<Input
									type="text"
									placeholder="HH:MM:SS"
									{...attrs}
									bind:value={$formData.total_duration}
								/>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<!--  on:change={(e) => {
									console.log('input:::::', e?.target?.value);
									$formData.total_duration = e?.target?.value;
								}}
								value={$formData.total_duration}-->
						<Form.Field {form} name="course_status">
							<Form.Control let:attrs>
								<Form.Label>Course Status</Form.Label>
								<span class="text-red-700"> *</span>
								<Select.Root
									selected={{
										value: $formData.course_status,
										label: $formData.course_status
									}}
									onSelectedChange={(s) => {
										s && ($formData.course_status = s.value);
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

						<Form.Field {form} name="course_category">
							<Form.Control let:attrs>
								<Form.Label>Course Category</Form.Label>
								<span class="text-red-700"> *</span>
								<Select.Root
									selected={{
										value: $formData.course_category,
										label: $formData.course_category
									}}
									onSelectedChange={(s) => {
										s && ($formData.course_category = s.value);
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

						<Form.Field {form} name="course_reported_financial_year">
							<Form.Control let:attrs>
								<Form.Label>Is the course reported on the previous financial year?</Form.Label>
								<span class="text-red-700"> *</span>
								<Select.Root
									selected={{
										value: $formData.course_reported_financial_year,
										label: $formData.course_reported_financial_year
									}}
									onSelectedChange={(s) => {
										s && ($formData.course_reported_financial_year = s.value);
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
						<Button type="submit">Submit</Button>
					</form>
				</Dialog.Content>
			</Dialog.Root>

			<div class="flex items-center justify-end space-x-4 py-4">
				<!-- <div class="flex-1 text-sm text-muted-foreground">
					{Object.keys($selectedDataIds).length} of{' '}
					{$rows.length} row(s) selected.
				</div> -->
				<Button
					variant="outline"
					size="sm"
					on:click={() => ($pageIndex = $pageIndex - 1)}
					disabled={!$hasPreviousPage}>Previous</Button
				>
				<Button
					variant="outline"
					size="sm"
					disabled={!$hasNextPage}
					on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
				>
			</div>
			<!-- {/if} -->
		</div>
	</div>
</main>
