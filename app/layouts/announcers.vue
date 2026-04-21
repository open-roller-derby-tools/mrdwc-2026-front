<template>
	<UApp>
		<div class="min-h-screen flex flex-col">
			<slot />
		</div>
	</UApp>
</template>

<script lang="ts" setup>
import { useVenuesStore } from "~/stores/venues";
import { useTeamsStore } from "~/stores/teams";

const venuesStore = useVenuesStore();
const teamsStore = useTeamsStore();

if (!import.meta.client) {
	await callOnce(venuesStore.fetch);
	await callOnce(teamsStore.fetch);
}
</script>
