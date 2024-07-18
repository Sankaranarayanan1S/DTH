<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index';
	import * as Card from '$lib/components/ui/card/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Label } from '$lib/components/ui/label/index';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<section class="flex min-h-screen flex-col items-center justify-center">
	<img src="/dth.png" alt="swayam prabha logo" class="mb-4 max-w-40" />
	<form
		class="w-full max-w-sm"
		method="POST"
		use:enhance={() => {
			return async ({ result }) => {
				// rerun the `load` function for the page
				// https://kit.svelte.dev/docs/modules#$app-navigation-invalidateall
				invalidateAll();

				// since we're customizing the default behaviour
				// we don't want to reimplement what `use:enhance` does
				// so we can use `applyResult` and pass the `result`
				await applyAction(result);
			};
		}}
	>
		{#if form?.invalid}
			<p class="error">Username and password is required.</p>
		{/if}

		{#if form?.credentials}
			<p class="error">You have entered the wrong credentials.</p>
		{/if}
		<Card.Root class="w-full max-w-sm">
			<Card.Header>
				<Card.Title class="text-2xl">Login</Card.Title>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<div class="grid gap-2">
					<Label for="username">User Name</Label>
					<Input id="username" name="username" type="text" required />
				</div>
				<div class="grid gap-2">
					<Label for="password">Password</Label>
					<Input id="password" name="password" type="password" required />
				</div>
			</Card.Content>
			<Card.Footer>
				<Button type="submit" class="w-full active:scale-95">Sign in</Button>
			</Card.Footer>
		</Card.Root>
	</form>
</section>
