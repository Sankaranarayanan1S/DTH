<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let form: ActionData;
	console.log(form);
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
			<!-- action="?/register" -->
			<form method="POST" use:enhance>
				{#if form?.user}
					<p class="error">Username is taken.</p>
				{/if}
				<input type="email" name="username" placeholder="email id" required />
				<input type="password" name="password" placeholder="password" required />
				<input type="password" name="re-type-password" placeholder="Re-Enter password" required />
				<button class="sign-up" type="submit">sign Up</button>
				<p class="sign-up-txt">Already have an account</p>
				<a href="/login">Login</a>
			</form>
		</div>
	</div>
</section>

<style src="../login/login.css">
</style>
