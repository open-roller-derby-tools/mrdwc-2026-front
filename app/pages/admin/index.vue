<template>
	<div class="space-y-8 p-8">
		<div class="grid grid-cols-3 gap-6">
			<div class="bg-gray-900 p-6 rounded-xl shadow">
				<p class="text-gray-400">Total notifications</p>
				<p class="text-3xl font-semibold mt-2">{{ stats.notifications }}</p>
			</div>

			<div class="bg-gray-900 p-6 rounded-xl shadow">
				<p class="text-gray-400">Total scheduled notifications</p>
				<p class="text-3xl font-semibold mt-2">{{ stats.scheduled_notifications }}</p>
			</div>

			<div class="bg-gray-900 p-6 rounded-xl shadow">
				<p class="text-gray-400">Total sent notifications</p>
				<p class="text-3xl font-semibold mt-2">{{ stats.sent_notifications }}</p>
			</div>

			<div class="bg-gray-900 p-6 rounded-xl shadow">
				<p class="text-gray-400">Active channels</p>
				<p class="text-3xl font-semibold mt-2">{{ stats.channels }}</p>
			</div>

			<div class="bg-gray-900 p-6 rounded-xl shadow">
				<p class="text-gray-400">Users subscribed</p>
				<p class="text-3xl font-semibold mt-2">{{ stats.subscriptions }}</p>
			</div>
		</div>
		<div class="pt-6">
			<button
				class="px-4 py-2 bg-yellow text-blue-text border-blue-text font-semibold rounded-xl"
				:disabled="loading"
				@click="initDb"
			>
				{{ loading ? "Initialisation..." : "Initialise database" }}
			</button>

			<p v-if="success" class="text-green-400 mt-2">Database initialised !</p>

			<p v-if="error" class="text-red-400 mt-2">Error : {{ error }}</p>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useNotificationsStore } from "~/stores/notifications";

definePageMeta({
	layout: "admin",
});

const gamesStore = useGamesStore();
const teamsStore = useTeamsStore();
const venuesStore = useVenuesStore();
const notificationsStore = useNotificationsStore();

const stats = ref({
	notifications: 0,
	channels: 0,
	subscriptions: 0,
	scheduled_notifications: 0,
	sent_notifications: 0,
});

onMounted(async () => {
	stats.value = await $fetch("/api/admin/stats");
	await gamesStore.fetch();
});

const loading = ref(false);
const success = ref(false);
const error = ref<string | null>(null);

async function initDb() {
	loading.value = true;
	success.value = false;
	error.value = null;

	try {
		await $fetch("/api/admin/init-db", {
			method: "POST",
			body: {
				games: gamesStore.games,
				teams: teamsStore.localizedTeams,
				venues: venuesStore.localizedVenues,
			},
		});

		success.value = true;

		// Refresh stats after successful init
		stats.value = await $fetch("/api/admin/stats");
		// Reload channels and notifications
		notificationsStore.channelsLoaded = false;
		await notificationsStore.fetchChannels();
		notificationsStore.scheduledNotificationsLoaded = false;
	} catch (err: any) {
		error.value = err?.data?.statusMessage ?? "Unknown error";
	} finally {
		loading.value = false;
	}
}
</script>
