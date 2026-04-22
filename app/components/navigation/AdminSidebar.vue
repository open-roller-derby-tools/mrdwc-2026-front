<template>
	<aside class="w-64 bg-blue-dark text-white h-[100vh] sticky p-6 flex flex-col gap-6">
		<h2 class="text-xl font-semibold">Notifications Dashboard</h2>

		<nav class="flex flex-col gap-4">
			<NuxtLink
				to="/admin"
				active-class="text-yellow font-bold"
				class="hover:text-yellow transition"
			>
				Dashboard
			</NuxtLink>

			<NuxtLink
				to="/admin/create-notification"
				active-class="text-yellow font-bold"
				class="hover:text-yellow transition"
			>
				Create notification
			</NuxtLink>

			<NuxtLink
				to="/admin/channels"
				active-class="text-yellow font-bold"
				class="hover:text-yellow transition"
			>
				Channels
			</NuxtLink>

			<NuxtLink
				to="http://localhost:3030/admin/queues"
				target="_blank"
				class="hover:text-yellow transition"
			>
				Bull Board
			</NuxtLink>
		</nav>
	</aside>
</template>
