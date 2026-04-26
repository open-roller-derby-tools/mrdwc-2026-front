<template>
	<div class="space-y-8 p-8">
		<h1 class="text-3xl font-bold">Channels</h1>
		<h2 class="text-2xl font-bold">Create Channel</h2>
		<!-- Create form -->
		<form class="space-y-4 max-w-md" @submit.prevent="createChannel">
			<div>
				<label class="block mb-1 text-gray-300">Name</label>
				<input
					v-model="name"
					:disabled="isGameChannel"
					class="w-full p-3 bg-gray-900 border border-gray-700 rounded"
				/>
			</div>

			<div>
				<label class="block mb-1 text-gray-300"
					>Slug (for a game channel, set the slug by "game_[GameId]")</label
				>
				<input v-model="slug" class="w-full p-3 bg-gray-900 border border-gray-700 rounded" />
			</div>

			<!-- Conditionnal fields -->
			<div v-if="isGameChannel" class="space-y-4">
				<!-- Team 1 -->
				<div>
					<label class="block mb-1 text-gray-300">Team 1</label>
					<select v-model="team_id_1" class="w-full p-3 bg-gray-900 border border-gray-700 rounded">
						<option v-for="t in teamsStore.teams" :key="t.id" :value="t.id">{{ t.name }}</option>
					</select>
				</div>
				<!-- Team 2 -->
				<div>
					<label class="block mb-1 text-gray-300">Team 2</label>
					<select v-model="team_id_2" class="w-full p-3 bg-gray-900 border border-gray-700 rounded">
						<option v-for="t in filteredTeam2List" :key="t.id" :value="t.id">
							{{ t.name }}
						</option>
					</select>
				</div>
				<!-- Track -->
				<div>
					<label class="block mb-1 text-gray-300">Track</label>
					<select v-model="track" class="w-full p-3 bg-gray-900 border border-gray-700 rounded">
						<option v-for="t in venuesStore.venues" :key="t.id" :value="t.id">{{ t.name }}</option>
					</select>
				</div>
			</div>

			<button class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white">
				Create channel
			</button>
		</form>

		<!-- Channels list -->
		<div class="space-y-4">
			<h2 class="text-2xl font-bold">Channel list</h2>
			<div
				v-for="c in channels"
				:key="c.id"
				class="bg-gray-900 p-4 rounded flex justify-between items-center"
			>
				<div>
					<p class="text-lg font-semibold">{{ c.name }}</p>
					<p class="text-gray-400 text-sm">{{ c.slug }}</p>
				</div>

				<p class="text-gray-500 text-sm">
					{{ new Date(c.created_at).toLocaleDateString() }}
				</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useVenuesStore } from "~/stores/venues";
import { useTeamsStore } from "~/stores/teams";

definePageMeta({
	layout: "admin",
});

const venuesStore = useVenuesStore();
const teamsStore = useTeamsStore();
const notificationsStore = useNotificationsStore();

const filteredTeam2List = computed(() =>
	teamsStore.localizedTeams.filter((t) => t.id !== team_id_1.value)
);

const isGameChannel = computed(() => slug.value.startsWith("game_"));
const team_id_1 = ref<number | null>(null);
const team_id_2 = ref<number | null>(null);
const track = ref<number | null>(null);

const channels = computed(() => notificationsStore.channels);
const name = ref<string>("");
const slug = ref<string>("");

const autoName = computed(() => {
	if (!isGameChannel.value) return "";

	const team1 = teamsStore.localizedTeams.find((t) => t.id === team_id_1.value);
	const team2 = teamsStore.localizedTeams.find((t) => t.id === team_id_2.value);

	if (!team1 || !team2) return "";

	return `Game ${team1.name} vs. ${team2.name}`;
});

watchEffect(() => {
	if (isGameChannel.value) {
		name.value = autoName.value;
	}
});

// Get existing channels

await notificationsStore.fetchChannels();

// Create new channel
async function createChannel() {
	await $fetch("/api/channels/create", {
		method: "POST",
		body: {
			name: name.value,
			slug: slug.value,
			team_id_1: isGameChannel.value ? team_id_1.value : null,
			team_id_2: isGameChannel.value ? team_id_2.value : null,
			track: isGameChannel.value ? track.value : null,
		},
	});
	//Reload list
	notificationsStore.channelsLoaded = false;
	await notificationsStore.fetchChannels();
	// Reset form
	name.value = "";
	slug.value = "";
	team_id_1.value = null;
	team_id_2.value = null;
	track.value = null;
}
</script>
