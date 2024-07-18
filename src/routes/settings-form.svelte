<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Fieldset, Legend, ElementField } from 'formsnap';
	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;

	function removeUrlByIndex(index: number) {
		$formData.urls = $formData.urls.filter((_, i) => i !== index);
	}

	function addUrl() {
		$formData.urls = [...$formData.urls, ''];
	}
</script>

<form method="POST" use:enhance>
	<Form.Fieldset {form} name="urls">
		<Form.Legend>username</Form.Legend>
		{#each $formData.urls as _, i}
			<Form.ElementField {form} name="urls[{i}]">
				<Form.Control let:attrs>
					<Form.Label>URL {i + 1}</Form.Label>
					<Input type="url" {...attrs} bind:value={$formData.urls[i]} />
					<button type="button" on:click={() => removeUrlByIndex(i)}> Remove URL </button>
				</Form.Control>
				<Form.Description>This is your public display name.</Form.Description>
				<Form.FieldErrors />
			</Form.ElementField>
		{/each}
		<Form.FieldErrors />
		<button type="button" on:click={addUrl}>Add URL</button>
	</Form.Fieldset>
	<Form.Button>Submit</Form.Button>
</form>
