<script lang="ts">
	import type { FormEntrySchema } from '$lib/components/schema';
	import { Pencil } from 'lucide-svelte';
	import type { Writable } from 'svelte/store';

	export let isDialogOpen: Writable<boolean>;
	export let row: FormEntrySchema;
	export let formData: Writable<FormEntrySchema>;
</script>

<button
	on:click={() => {
		$isDialogOpen = !$isDialogOpen;
		console.log('god');
		formData.set(row);
		console.log($formData);
	}}><Pencil /></button
>
