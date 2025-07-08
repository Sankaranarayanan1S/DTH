<script lang="ts">
	import Qcard from '$lib/components/Qcard.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs/index.js';
	import type { PageData } from './$types.js';
	import SettingsForm from './settings-form.svelte';
	export let data: PageData;
</script>

<main class="flex h-full min-h-dvh flex-col bg-orange-50">
	<div class="mx-auto my-16 max-w-7xl items-center rounded-lg border bg-white p-8 py-16 shadow-md">
		<div>
			<!-- <Label for="coordinating_nc" class="text-nowrap"> -->
			<p class="text-center text-3xl">Welcome : {data.data.admin_institute}</p>
			<!-- </Label> -->
		</div>

		<div class="mb-8 flex w-full justify-between">
			<div class="flex items-center gap-4">
				<p class="text-nowrap">Financial Year: 2025-2026</p>
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
				<Qcard institute={data.data.institute} admin_institute={data.data.admin_institute}  quater="q1" dataform={data.form2} />
			</TabsContent>
			<TabsContent value="Q2">
				<Qcard institute={data.data.institute} admin_institute={data.data.admin_institute} quater="q2" dataform={data.form2} />
				<!-- <SettingsForm data={data.form} /> -->
			</TabsContent>

			<TabsContent value="Q3">
				<Qcard institute={data.data.institute}  admin_institute={data.data.admin_institute} quater="q3"  dataform={data.form2} />
				<!-- <Qcard institute={data.data.institute} quater="q3" /> -->
			</TabsContent>

			<TabsContent value="Q4">
				<Qcard institute={data.data.institute} admin_institute={data.data.admin_institute} quater="q4" dataform={data.form2} />
				<!-- <Qcard institute={data.data.institute} quater="q4" /> -->
			</TabsContent>
		</Tabs>
	</div>
</main>
