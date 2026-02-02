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
import { readable, writable, get, type Writable } from 'svelte/store';
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
import { mkConfig, generateCsv, download } from 'export-to-csv';
	import {
		formEntrySchema,
		formSchema2,
		type FormSchema2,
		type FormEntrySchema
	} from '$lib/components/schema';
import { course_name } from '$lib/components/course_name';
import { discipline } from '$lib/components/discipline';
import { goto } from '$app/navigation';

export let data;
let adminSummary = data.adminSummary ?? [];
let availableYears = data.availableYears ?? [];
let selectedYear: string =
	data.selectedYear ?? (availableYears.length ? availableYears[0] : '2024 - 2025');
let activeTab: 'courses' | 'summary' | 'youtube_statistics' | 'youtube_summary' = 'courses';

let youtubeStats = data.youtubeStats ?? [];
let youtubeSummary = data.youtubeSummary ?? [];
let youtubeCategorySummary = data.youtubeCategorySummary ?? [];
let youtubeChannelCategories = data.youtubeChannelCategories ?? [];
let youtubeYears = data.youtubeYears ?? [];
let selectedYtCategory: string =
	data.selectedYtCategory ?? (youtubeChannelCategories.length ? youtubeChannelCategories[0] : '22 Channels');
let selectedYtYear: number =
	data.selectedYtYear ?? (youtubeYears.length ? youtubeYears[0] : 2017);
let selectedYtSummaryCategory: string =
	data.selectedYtSummaryCategory ?? (youtubeChannelCategories.length ? youtubeChannelCategories[0] : '22 Channels');

let ytSummaryMenu: 'by_channel' | 'summary' = 'by_channel';

// Mapping of channel categories to their available years
const categoryToYears: Record<string, number[]> = {
	'22 Channels': [2021, 2022, 2023],
	'32 Channels': [2017, 2018, 2019, 2020],
	'40 Channels': [2023, 2024, 2025],
	'40 Channels Rearrangement': [2025]
};

// Reactive variable for available years based on selected category
$: availableYtYears = categoryToYears[selectedYtCategory] ?? [];

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
		CEC: ['1', '2', '3', '4', '5', '6', '7','Cross Content'],
		INFLIBNET: ['8', 'Cross Content'],
    	'MIC_AICTE': ['9', 'Cross Content'],
		IGNOU: ['10','11', '12', '13', '14', '15', '16', 'Cross Content'],
		'IIT Bombay': ['17', '18', '19', '20', 'Cross Content'],
		'IIT Delhi': ['21', '22', 'Cross Content'],
		'IIT Gandhinagar': ['23', 'Cross Content'],
		'IIT Kanpur': ['24', '25', '26', '27', '28', 'Cross Content'],
		'IIT Kharagpur': ['29', '30', 'Cross Content'],
		'IIT Madras': ['31', '32', '33', '34', '35', '36', 'Cross Content'],
		'IIT Tirupati': ['37', '38', 'Cross Content'],
		'University of Hyderabad': ['39','40', 'Cross Content']
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

// Config follows the recommended options from the official export-to-csv docs:
// https://www.npmjs.com/package/export-to-csv
const csvConfig = mkConfig({
	fieldSeparator: ',',
	filename: 'course-data',
	decimalSeparator: '.',
	useBom: true,
	useKeysAsHeaders: true
});

const runCsvExport = () => {
	const filteredRows = get(rows);

	if (!filteredRows?.length) {
		console.warn('No rows available to export.');
		return;
	}

	const exporter = generateCsv(csvConfig);
	const downloader = download(csvConfig);
	const dataset = filteredRows.map((row) => row.original);
	downloader(exporter(dataset));
};

const runSummaryCsvExport = () => {
	const summaryData = adminSummary ?? [];

	if (!summaryData.length) {
		console.warn('No institute duration data available to export.');
		return;
	}

	const filenameYear = selectedYear?.replace(/\s+/g, '') ?? 'summary';
	const summaryConfig = mkConfig({
		fieldSeparator: ',',
		filename: `institute-durations-${filenameYear}`,
		decimalSeparator: '.',
		useBom: true,
		useKeysAsHeaders: true
	});

	const exporter = generateCsv(summaryConfig);
	const downloader = download(summaryConfig);
	const dataset = summaryData.map((row) => ({
		Institute: row.admin_institute,
		Q1_Duration: row.Q1_Duration ?? '00:00:00',
		Q2_Duration: row.Q2_Duration ?? '00:00:00',
		Q3_Duration: row.Q3_Duration ?? '00:00:00',
		Q4_Duration: row.Q4_Duration ?? '00:00:00',
		Total_Duration: row.Total_Duration ?? '00:00:00'
	}));

	downloader(exporter(dataset));
};

const runYoutubeStatsCsvExport = () => {
	const statsData = youtubeStats ?? [];

	if (!statsData.length) {
		console.warn('No YouTube statistics data available to export.');
		return;
	}

	const filenameCategory = selectedYtCategory?.replace(/\s+/g, '') ?? 'youtube-stats';
	const filenameYear = selectedYtYear?.toString() ?? 'all-years';
	const statsConfig = mkConfig({
		fieldSeparator: ',',
		filename: `youtube-statistics-${filenameCategory}-${filenameYear}`,
		decimalSeparator: '.',
		useBom: true,
		useKeysAsHeaders: true
	});

	const exporter = generateCsv(statsConfig);
	const downloader = download(statsConfig);
	const dataset = statsData.map((row) => ({
		'Channel Name': row.Channels_Name,
		'National Coordinator': row.national_coordinator,
		'Broadcast Videos Count': row.broadcast_videos,
		'Broadcast Videos Hours': row.broadcast_videos_hours,
		'Youtube Views': row.Youtube_Views,
		'Youtube Subscriptions': row.Youtube_Subscription,
		Year: row.Year
	}));

	downloader(exporter(dataset));
};

const runYoutubeSummaryCsvExport = () => {
	if (ytSummaryMenu === 'by_channel') {
		const summaryData = youtubeSummary ?? [];

		if (!summaryData.length) {
			console.warn('No YouTube summary data available to export.');
			return;
		}

		const filenameCategory = selectedYtSummaryCategory?.replace(/\s+/g, '') ?? 'youtube-summary';
		const summaryConfig = mkConfig({
			fieldSeparator: ',',
			filename: `youtube-summary-by-channel-${filenameCategory}`,
			decimalSeparator: '.',
			useBom: true,
			useKeysAsHeaders: true
		});

		const exporter = generateCsv(summaryConfig);
		const downloader = download(summaryConfig);
		const dataset = summaryData.map((row) => ({
			'Channel Number': row.Channel_Number ?? 'TOTAL',
			'Total Broadcast Videos Count': row.Total_Broadcast_Videos_Count,
			'Total Broadcast Videos Hours': row.Total_Broadcast_Videos_Hours,
			'Total Youtube Views': row.Total_Youtube_Views,
			'Total Youtube Subscriptions': row.total_youtube_subscription
		}));

		downloader(exporter(dataset));
	} else {
		const categorySummaryData = sortedYoutubeCategorySummary ?? [];

		if (!categorySummaryData.length) {
			console.warn('No YouTube category summary data available to export.');
			return;
		}

		const categoryConfig = mkConfig({
			fieldSeparator: ',',
			filename: 'youtube-summary-by-category',
			decimalSeparator: '.',
			useBom: true,
			useKeysAsHeaders: true
		});

		const exporter = generateCsv(categoryConfig);
		const downloader = download(categoryConfig);
		const dataset = categorySummaryData.map((row) => ({
			'Channel Category': row.channel_category ?? 'TOTAL',
			Years: row.Years ?? '',
			'Total Broadcast Videos Count': row.Total_Broadcast_Videos_Count,
			'Total Broadcast Videos Hours': row.Total_Broadcast_Videos_Hours,
			'Total Youtube Views': row.Total_Youtube_Views,
			'Total Youtube Subscription': row.Total_Youtube_Subscription
		}));

		downloader(exporter(dataset));
	}
};

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

function handleYearChange(year: string | null) {
	if (!year || year === selectedYear) {
		return;
	}

	selectedYear = year;

	if (typeof window === 'undefined') return;

	const params = new URLSearchParams(window.location.search);
	params.set('year', year);

	goto(`?${params.toString()}`, {
		replaceState: true,
		keepFocus: true,
		noScroll: true
	});
}

function handleYtCategoryChange(category: string | null) {
	if (!category || category === selectedYtCategory) {
		return;
	}

	selectedYtCategory = category;

	// Auto-select the first available year for the selected category
	const availableYears = categoryToYears[category] ?? [];
	if (availableYears.length > 0) {
		selectedYtYear = availableYears[0];
	}

	if (typeof window === 'undefined') return;

	const params = new URLSearchParams(window.location.search);
	params.set('ytCategory', category);
	if (availableYears.length > 0) {
		params.set('ytYear', availableYears[0].toString());
	}

	goto(`?${params.toString()}`, {
		replaceState: true,
		keepFocus: true,
		noScroll: true
	});
}

function handleYtYearChange(year: number | null) {
	if (!year || year === selectedYtYear) {
		return;
	}

	selectedYtYear = year;

	if (typeof window === 'undefined') return;

	const params = new URLSearchParams(window.location.search);
	params.set('ytYear', year.toString());

	goto(`?${params.toString()}`, {
		replaceState: true,
		keepFocus: true,
		noScroll: true
	});
}

function handleYtSummaryCategoryChange(category: string | null) {
	if (!category || category === selectedYtSummaryCategory) {
		return;
	}

	selectedYtSummaryCategory = category;

	if (typeof window === 'undefined') return;

	const params = new URLSearchParams(window.location.search);
	params.set('ytSummaryCategory', category);

	goto(`?${params.toString()}`, {
		replaceState: true,
		keepFocus: true,
		noScroll: true
	});
}

$: adminSummary = data.adminSummary ?? [];
$: availableYears = data.availableYears ?? [];
$: selectedYear = data.selectedYear ?? selectedYear;
$: youtubeStats = data.youtubeStats ?? [];
$: youtubeSummary = data.youtubeSummary ?? [];
$: youtubeCategorySummary = data.youtubeCategorySummary ?? [];
$: youtubeChannelCategories = data.youtubeChannelCategories ?? [];
$: youtubeYears = data.youtubeYears ?? [];
$: selectedYtCategory = data.selectedYtCategory ?? selectedYtCategory;
$: selectedYtYear = data.selectedYtYear ?? selectedYtYear;
$: selectedYtSummaryCategory = data.selectedYtSummaryCategory ?? selectedYtSummaryCategory;

// Sort summary data in the specified order: 32 Channels, 22 Channels, 40 Channels, 40 Channels Rearrangement, TOTAL
$: sortedYoutubeCategorySummary = (() => {
	const categoryOrder: Record<string, number> = {
		'32 Channels': 1,
		'22 Channels': 2,
		'40 Channels': 3,
		'40 Channels Rearrangement': 4,
		'TOTAL': 999
	};
	
	const summary = youtubeCategorySummary ?? [];
	return [...summary].sort((a, b) => {
		const aCategory = a.channel_category ?? 'TOTAL';
		const bCategory = b.channel_category ?? 'TOTAL';
		const aOrder = categoryOrder[aCategory] ?? 999;
		const bOrder = categoryOrder[bCategory] ?? 999;
		return aOrder - bOrder;
	});
})();

// Ensure selected year is valid for the current category (only adjust if invalid, don't update URL here)
$: {
	if (availableYtYears.length > 0 && !availableYtYears.includes(selectedYtYear)) {
		selectedYtYear = availableYtYears[0];
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

		<div class="mb-6 border-b border-zinc-200">
			<nav class="-mb-px flex flex-wrap gap-4 text-sm font-medium text-muted-foreground">
				<button
					type="button"
					class={`border-b-2 pb-2 transition focus-visible:outline-none ${
						activeTab === 'courses'
							? 'border-orange-500 text-orange-600'
							: 'border-transparent hover:text-zinc-900'
					}`}
					on:click={() => (activeTab = 'courses')}
				>
					Course Details
				</button>
				<button
					type="button"
					class={`border-b-2 pb-2 transition focus-visible:outline-none ${
						activeTab === 'summary'
							? 'border-orange-500 text-orange-600'
							: 'border-transparent hover:text-zinc-900'
					}`}
					on:click={() => (activeTab = 'summary')}
				>
					Institute Durations
				</button>
				<button
					type="button"
					class={`border-b-2 pb-2 transition focus-visible:outline-none ${
						activeTab === 'youtube_statistics'
							? 'border-orange-500 text-orange-600'
							: 'border-transparent hover:text-zinc-900'
					}`}
					on:click={() => (activeTab = 'youtube_statistics')}
				>
					Youtube Channel/Year wise Statistics
				</button>
				<button
					type="button"
					class={`border-b-2 pb-2 transition focus-visible:outline-none ${
						activeTab === 'youtube_summary'
							? 'border-orange-500 text-orange-600'
							: 'border-transparent hover:text-zinc-900'
					}`}
					on:click={() => (activeTab = 'youtube_summary')}
				>
					Youtube Summary
				</button>
			</nav>
		</div>

		{#if activeTab === 'courses'}
			<div class="mb-4 flex flex-wrap gap-2">
				<Button type="button" on:click={runCsvExport}>Download CSV</Button>
				<!-- <Button variant="outline">
					<a href="/" target="_blank">Home page</a>
				</Button> -->
			</div>

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
	{:else if activeTab === 'summary'}
		<div class="mb-4 flex flex-wrap items-center gap-3">
			<span class="text-sm font-medium text-muted-foreground">Financial Year</span>
			<Select.Root
				selected={{ value: selectedYear, label: selectedYear }}
				onSelectedChange={(s) => handleYearChange(s?.value ?? null)}
			>
				<Select.Trigger class="w-[200px]">
					<Select.Value placeholder="Select Year" class="text-left" />
				</Select.Trigger>
				<Select.Content class="max-h-[250px] overflow-y-auto">
					{#each availableYears as year}
						<Select.Item value={year}>{year}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			<Button class="ml-auto" type="button" on:click={runSummaryCsvExport}>
				Download CSV
			</Button>
		</div>

		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Institute</Table.Head>
						<Table.Head>Q1 Duration</Table.Head>
						<Table.Head>Q2 Duration</Table.Head>
						<Table.Head>Q3 Duration</Table.Head>
						<Table.Head>Q4 Duration</Table.Head>
						<Table.Head>Total Duration</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if adminSummary.length === 0}
						<Table.Row>
							<Table.Cell colspan={6} class="text-center text-muted-foreground">
								No duration data available for the selected year.
							</Table.Cell>
						</Table.Row>
					{:else}
						{#each adminSummary as summary (summary.admin_institute)}
							<Table.Row>
								<Table.Cell class="font-medium">{summary.admin_institute}</Table.Cell>
								<Table.Cell>{summary.Q1_Duration ?? '00:00:00'}</Table.Cell>
								<Table.Cell>{summary.Q2_Duration ?? '00:00:00'}</Table.Cell>
								<Table.Cell>{summary.Q3_Duration ?? '00:00:00'}</Table.Cell>
								<Table.Cell>{summary.Q4_Duration ?? '00:00:00'}</Table.Cell>
								<Table.Cell class="font-semibold">
									{summary.Total_Duration ?? '00:00:00'}
								</Table.Cell>
							</Table.Row>
						{/each}
					{/if}
				</Table.Body>
			</Table.Root>
		</div>
	{:else if activeTab === 'youtube_statistics'}
		<div class="mb-4 flex flex-wrap items-center gap-3">
			<span class="text-sm font-medium text-muted-foreground">Channel Category</span>
			<Select.Root
				selected={{ value: selectedYtCategory, label: selectedYtCategory }}
				onSelectedChange={(s) => handleYtCategoryChange(s?.value ?? null)}
			>
				<Select.Trigger class="w-[200px]">
					<Select.Value placeholder="Select Category" class="text-left" />
				</Select.Trigger>
				<Select.Content class="max-h-[250px] overflow-y-auto">
					{#each youtubeChannelCategories as category}
						<Select.Item value={category}>{category}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			<span class="text-sm font-medium text-muted-foreground">Year</span>
			<Select.Root
				selected={{ value: selectedYtYear.toString(), label: selectedYtYear.toString() }}
				onSelectedChange={(s) => handleYtYearChange(s?.value ? Number(s.value) : null)}
			>
				<Select.Trigger class="w-[200px]">
					<Select.Value placeholder="Select Year" class="text-left" />
				</Select.Trigger>
				<Select.Content class="max-h-[250px] overflow-y-auto">
					{#each availableYtYears as year}
						<Select.Item value={year.toString()}>{year}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			<Button class="ml-auto" type="button" on:click={runYoutubeStatsCsvExport}>
				Download CSV
			</Button>
		</div>

		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Channel Name</Table.Head>
						<Table.Head>National Coordinator</Table.Head>
						<Table.Head>Broadcast Videos Count</Table.Head>
						<Table.Head>Broadcast Videos Hours</Table.Head>
						<Table.Head>Youtube Views</Table.Head>
						<Table.Head>Youtube Subscriptions</Table.Head>
						<Table.Head>Year</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if youtubeStats.length === 0}
						<Table.Row>
							<Table.Cell colspan={7} class="text-center text-muted-foreground">
								No statistics data available for the selected category and year.
							</Table.Cell>
						</Table.Row>
					{:else}
						{#each youtubeStats as stat (stat.Channels_Name + stat.Year)}
							<Table.Row>
								<Table.Cell class="font-medium">{stat.Channels_Name}</Table.Cell>
								<Table.Cell>{stat.national_coordinator}</Table.Cell>
								<Table.Cell>{stat.broadcast_videos}</Table.Cell>
								<Table.Cell>{stat.broadcast_videos_hours}</Table.Cell>
								<Table.Cell>{stat.Youtube_Views.toLocaleString()}</Table.Cell>
								<Table.Cell>{stat.Youtube_Subscription.toLocaleString()}</Table.Cell>
								<Table.Cell>{stat.Year}</Table.Cell>
							</Table.Row>
						{/each}
					{/if}
				</Table.Body>
			</Table.Root>
		</div>
	{:else if activeTab === 'youtube_summary'}
		<!-- Enhanced Menu Navigation -->
		<div class="mb-6">
			<div class="mb-4 flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-3">
				<button
					type="button"
					class={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
						ytSummaryMenu === 'by_channel'
							? 'bg-orange-500 text-white shadow-md shadow-orange-200'
							: 'bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 border border-zinc-200'
					}`}
					on:click={() => (ytSummaryMenu = 'by_channel')}
				>
					By Channel Number
				</button>
				<button
					type="button"
					class={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
						ytSummaryMenu === 'summary'
							? 'bg-orange-500 text-white shadow-md shadow-orange-200'
							: 'bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 border border-zinc-200'
					}`}
					on:click={() => (ytSummaryMenu = 'summary')}
				>
					Summary
				</button>
			</div>
			{#if ytSummaryMenu === 'by_channel'}
				<div class="flex flex-wrap items-center gap-3">
					<span class="text-sm font-semibold text-zinc-700">Channel Category</span>
					<Select.Root
						selected={{ value: selectedYtSummaryCategory, label: selectedYtSummaryCategory }}
						onSelectedChange={(s) => handleYtSummaryCategoryChange(s?.value ?? null)}
					>
						<Select.Trigger class="w-[200px]">
							<Select.Value placeholder="Select Category" class="text-left" />
						</Select.Trigger>
						<Select.Content class="max-h-[250px] overflow-y-auto">
							{#each youtubeChannelCategories as category}
								<Select.Item value={category}>{category}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<Button class="ml-auto" type="button" on:click={runYoutubeSummaryCsvExport}>
						Download CSV
					</Button>
				</div>
			{:else if ytSummaryMenu === 'summary'}
				<div class="flex flex-wrap items-center gap-3">
					<div class="rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 p-4 border border-orange-100 flex-1">
						<h3 class="text-lg font-bold text-zinc-800 mb-1">Category-wise Summary</h3>
						<p class="text-sm text-zinc-600">
							Aggregated statistics across all channel categories with total overview
						</p>
					</div>
					<Button class="ml-auto" type="button" on:click={runYoutubeSummaryCsvExport}>
						Download CSV
					</Button>
				</div>
			{/if}
		</div>

		{#if ytSummaryMenu === 'by_channel'}
			<div class="rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
				<Table.Root>
					<Table.Header>
						<Table.Row class="bg-zinc-50">
							<Table.Head class="font-semibold text-zinc-700">Channel Number</Table.Head>
							<Table.Head class="font-semibold text-zinc-700">Total Broadcast Videos Count</Table.Head>
							<Table.Head class="font-semibold text-zinc-700">Total Broadcast Videos Hours</Table.Head>
							<Table.Head class="font-semibold text-zinc-700">Total Youtube Views</Table.Head>
							<Table.Head class="font-semibold text-zinc-700">Total Youtube Subscriptions</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#if youtubeSummary.length === 0}
							<Table.Row>
								<Table.Cell colspan={5} class="text-center text-muted-foreground py-8">
									No summary data available for the selected category.
								</Table.Cell>
							</Table.Row>
						{:else}
							{#each youtubeSummary as summary (summary.Channel_Number ?? 'TOTAL')}
								<Table.Row
									class={`transition-colors ${
										summary.Channel_Number === 'TOTAL'
											? 'bg-gradient-to-r from-orange-100 to-amber-50 font-semibold border-t-2 border-orange-300'
											: 'hover:bg-zinc-50'
									}`}
								>
									<Table.Cell
										class={`py-3 ${
											summary.Channel_Number === 'TOTAL'
												? 'font-bold text-orange-900 text-base'
												: 'font-medium text-zinc-800'
										}`}
									>
										{summary.Channel_Number ?? 'TOTAL'}
									</Table.Cell>
									<Table.Cell
										class={summary.Channel_Number === 'TOTAL' ? 'font-semibold text-zinc-900' : 'text-zinc-700'}
									>
										{summary.Total_Broadcast_Videos_Count.toLocaleString()}
									</Table.Cell>
									<Table.Cell
										class={summary.Channel_Number === 'TOTAL' ? 'font-semibold text-zinc-900' : 'text-zinc-700'}
									>
										{summary.Total_Broadcast_Videos_Hours}
									</Table.Cell>
									<Table.Cell
										class={summary.Channel_Number === 'TOTAL' ? 'font-semibold text-zinc-900' : 'text-zinc-700'}
									>
										{summary.Total_Youtube_Views.toLocaleString()}
									</Table.Cell>
									<Table.Cell
										class={summary.Channel_Number === 'TOTAL' ? 'font-semibold text-zinc-900' : 'text-zinc-700'}
									>
										{summary.total_youtube_subscription.toLocaleString()}
									</Table.Cell>
								</Table.Row>
							{/each}
						{/if}
					</Table.Body>
				</Table.Root>
			</div>
		{:else}
			<div class="rounded-lg border border-zinc-200 shadow-sm overflow-hidden bg-white">
				<Table.Root>
					<Table.Header>
						<Table.Row class="bg-gradient-to-r from-orange-500 to-amber-500">
							<Table.Head class="font-bold text-white text-sm">Channel Category</Table.Head>
							<Table.Head class="font-bold text-white text-sm">Years</Table.Head>
							<Table.Head class="font-bold text-white text-sm text-right">Total Broadcast Videos Count</Table.Head>
							<Table.Head class="font-bold text-white text-sm">Total Broadcast Videos Hours</Table.Head>
							<Table.Head class="font-bold text-white text-sm text-right">Total Youtube Views</Table.Head>
							<Table.Head class="font-bold text-white text-sm text-right">Total Youtube Subscription</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#if sortedYoutubeCategorySummary.length === 0}
							<Table.Row>
								<Table.Cell colspan={6} class="text-center text-muted-foreground py-12">
									<div class="flex flex-col items-center gap-2">
										<svg
											class="w-12 h-12 text-zinc-300"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
											/>
										</svg>
										<p class="text-base font-medium">No summary data available</p>
									</div>
								</Table.Cell>
							</Table.Row>
						{:else}
							{#each sortedYoutubeCategorySummary as row (row.channel_category ?? 'TOTAL')}
								<Table.Row
									class={`transition-all ${
										row.channel_category === 'TOTAL'
											? 'bg-gradient-to-r from-orange-100 via-orange-50 to-amber-50 font-bold border-t-4 border-orange-400 shadow-sm'
											: 'hover:bg-zinc-50 border-b border-zinc-100'
									}`}
								>
									<Table.Cell
										class={`py-4 ${
											row.channel_category === 'TOTAL'
												? 'font-extrabold text-orange-900 text-lg'
												: 'font-semibold text-zinc-800'
										}`}
									>
										{#if row.channel_category === 'TOTAL'}
											<span class="inline-flex items-center gap-2">
												<svg
													class="w-5 h-5 text-orange-600"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
													/>
												</svg>
												{row.channel_category}
											</span>
										{:else}
											<span class="inline-flex items-center gap-2">
												<span
													class="w-2 h-2 rounded-full bg-orange-400"
												></span>
												{row.channel_category}
											</span>
										{/if}
									</Table.Cell>
									<Table.Cell
										class={row.channel_category === 'TOTAL' ? 'font-semibold text-zinc-900' : 'text-zinc-700'}
									>
										{#if row.Years}
											<span
												class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
											>
												{row.Years}
											</span>
										{:else}
											<span class="text-zinc-400">-</span>
										{/if}
									</Table.Cell>
									<Table.Cell
										class={`text-right ${
											row.channel_category === 'TOTAL'
												? 'font-bold text-zinc-900 text-base'
												: 'font-medium text-zinc-800'
										}`}
									>
										{row.Total_Broadcast_Videos_Count.toLocaleString()}
									</Table.Cell>
									<Table.Cell
										class={row.channel_category === 'TOTAL' ? 'font-semibold text-zinc-900' : 'text-zinc-700 font-mono'}
									>
										{row.Total_Broadcast_Videos_Hours}
									</Table.Cell>
									<Table.Cell
										class={`text-right ${
											row.channel_category === 'TOTAL'
												? 'font-bold text-zinc-900 text-base'
												: 'font-medium text-zinc-800'
										}`}
									>
										{row.Total_Youtube_Views.toLocaleString()}
									</Table.Cell>
									<Table.Cell
										class={`text-right ${
											row.channel_category === 'TOTAL'
												? 'font-bold text-zinc-900 text-base'
												: 'font-medium text-zinc-800'
										}`}
									>
										{row.Total_Youtube_Subscription.toLocaleString()}
									</Table.Cell>
								</Table.Row>
							{/each}
						{/if}
					</Table.Body>
				</Table.Root>
			</div>
		{/if}
	{/if}
	</div>
</main>
