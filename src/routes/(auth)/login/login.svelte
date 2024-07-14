<script lang="ts">
	import type { ActionData } from './$types';
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	export let form: ActionData;
</script>

<section>
	<div class="left">
		<h1><span>Lingo</span>Refresh</h1>
		<h2>Refresh your spoken english</h2>
		<img src="/images/login.png" alt="A man with a tablet computer" class="login-img-desktop" />
	</div>
	<div class="right-container">
		<img
			src="/images/login-mobile.png"
			alt="A man with a tablet computer"
			class="login-img-mobile"
		/>
		<img
			src="/images/leaves-left.png"
			alt="two leaves to the left of the man"
			class="leaves-left"
		/>
		<img
			src="/images/leaves-right.png"
			alt="two leaves to the right of the man"
			class="leaves-right"
		/>

		<div class="right">
			<!-- action="?/login" -->
			<form
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
				<input type="email" name="username" placeholder="email id" required />
				<input type="password" name="password" placeholder="password" required />
				<button class="sign-up" type="submit">sign in</button>
				<a href="http://">Forgot Your Password?</a>
				<p class="sign-up-txt">Don't have an account</p>
				<a href="/register">sign up</a>
			</form>
		</div>
	</div>
</section>

<style src="./login.css"></style>
