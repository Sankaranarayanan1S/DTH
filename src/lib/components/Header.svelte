<script>
	import { Button } from '$lib/components/ui/button/index';
</script>

<header class="flex items-center justify-between bg-orange-400 p-4 text-white">
	<img src="/dth.png" alt="Swayam Prabha" class="max-w-40" />
	<h1 class="text-2xl">
		<b>NITI Aayog Dashboard</b>
	</h1>
	<form action="/logout">
		<Button type="submit">Log Out</Button>
	</form>
</header>
