<template>
	<UApp>
		<div class="min-h-screen flex flex-col">
			<div class="flex flex-1 min-h-0">
				<AdminSidebar />
				<slot />
			</div>
		</div>
	</UApp>
</template>

<script lang="ts" setup>
import AdminSidebar from "~/components/navigation/AdminSidebar.vue";
import { useVenuesStore } from "~/stores/venues";
import { useTeamsStore } from "~/stores/teams";
import { useNotificationsStore } from "~/stores/notifications";

const venuesStore = useVenuesStore();
const teamsStore = useTeamsStore();
const notificationsStore = useNotificationsStore();
const gamesStore = useGamesStore();

// Only fetch from API on the server (SSR or when running `nuxt generate`).
// On the client, data comes from the static payload (when serving the static output).
if (!import.meta.client) {
	await callOnce(venuesStore.fetch);
	await callOnce(gamesStore.fetch);
	await callOnce(teamsStore.fetch);
	await callOnce(notificationsStore.fetchChannels);
	await callOnce(notificationsStore.fetchScheduledNotifications);
}
</script>
