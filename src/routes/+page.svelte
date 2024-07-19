<script lang="ts">
	import Qcard from '$lib/components/Qcard.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import {
		Select,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectLabel,
		SelectTrigger,
		SelectValue
	} from '$lib/components/ui/select/index.js';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs/index.js';
	import type { PageData } from './$types.js';
	import SettingsForm from './settings-form.svelte';
	export let data: PageData;
</script>

<main class="flex h-full min-h-dvh flex-col bg-orange-50">
	<div class="mx-auto my-16 max-w-7xl items-center rounded-lg border bg-white p-8 py-16 shadow-md">
		<div>
			<Label for="coordinating_nc" class="text-nowrap">
				<!-- <p class="text-center text-3xl">Welcome : {!isLoading ? data?.institute : 'loading'}</p> -->
			</Label>
		</div>

		<div class="mb-8 flex w-full justify-between">
			<div class="flex items-center gap-4">
				<p class="text-nowrap">Financial Year: 2024-2025</p>

				<!-- <form id="financial_year">
					<Select name="year">
						<SelectTrigger class="">
							<SelectValue placeholder="Select" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Years</SelectLabel>

								<SelectItem value="2023-2024">2023-2024</SelectItem>
								<SelectItem value="2024-2025">2024-2025</SelectItem>
								<SelectItem value="2025-2026">2025-2026</SelectItem>
								<SelectItem value="2026-2027">2026-2027</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</form> -->
			</div>
		</div>
		<Tabs value="Q1" class="w-full">
			<TabsList class="grid w-full grid-cols-4">
				<TabsTrigger value="Q1">Q1</TabsTrigger>
				<TabsTrigger value="Q2">Q2</TabsTrigger>
				<TabsTrigger value="Q3">Q3</TabsTrigger>
				<TabsTrigger value="Q4">Q4</TabsTrigger>
			</TabsList>

			<TabsContent value="Q1">
				<Qcard institute={data.data.institute} quater="q1" />
			</TabsContent>
			<TabsContent value="Q2">
				<Qcard institute={data.data.institute} quater="q2" />
			</TabsContent>

			<TabsContent value="Q3">
				<Qcard institute={data.data.institute} quater="q3" />
			</TabsContent>

			<TabsContent value="Q4">
				<Qcard institute={data.data.institute} quater="q4" />
			</TabsContent>
		</Tabs>
	</div>
</main>
