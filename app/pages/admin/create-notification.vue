<template>
	<div class="space-y-8 p-8">
		<h1 class="text-3xl font-bold">Create Notification</h1>

		<form class="space-y-6 max-w-xl" @submit="handleSubmit">
			<!-- Channel -->
			<div>
				<label class="block mb-2 text-gray-300">Channel</label>
				<select
					v-model="channel"
					required
					class="w-full p-3 bg-gray-900 rounded border border-gray-700"
				>
					<option v-for="c in channels" :key="c.id" :value="c">
						{{ c.name }}
					</option>
				</select>
			</div>
			<!-- Notification type -->
			<div v-if="availableNotificationTypes.length > 0">
				<label class="block mb-2 text-gray-300">Notification type</label>
				<select
					v-model="notificationType"
					required
					class="w-full p-3 bg-gray-900 rounded border border-gray-700"
				>
					<option v-for="t in availableNotificationTypes" :key="t.index" :value="t">
						{{ t.label }}
					</option>
				</select>
			</div>
			<!-- Title -->
			<div>
				<label class="block mb-2 text-gray-300">Title</label>
				<input
					:value="autoTitle"
					readonly
					class="w-full p-3 bg-gray-900 rounded border border-gray-700 opacity-70 cursor-not-allowed"
				/>
			</div>
			<!-- score -->
			<div
				v-if="
					channel &&
					notificationType &&
					['intermission', 'end of game'].includes(notificationType.label)
				"
				class="flex gap-4"
			>
				<!-- Score 1 -->
				<div class="flex-1">
					<label class="block mb-2 text-gray-300"> {{ team1Name }} score </label>
					<input
						v-model="score1"
						required
						type="number"
						name="score team 1"
						class="w-full p-3 bg-gray-900 rounded border border-gray-700"
					/>
				</div>
				<!-- Score 2 -->
				<div class="flex-1">
					<label class="block mb-2 text-gray-300"> {{ team2Name }} score </label>
					<input
						v-model="score2"
						type="number"
						required
						name="score team 2"
						class="w-full p-3 bg-gray-900 rounded border border-gray-700"
					/>
				</div>
			</div>
			<!-- Game delay in minutes -->
			<div v-if="channel && notificationType && notificationType.label === 'late'" class="mt-4">
				<label class="block mb-2 text-gray-300">Minutes de retard</label>
				<input
					v-model="gameDelay"
					type="number"
					name="minutes"
					min="1"
					required
					class="w-full p-3 bg-gray-900 rounded border border-gray-700"
				/>
			</div>
			<!-- Content -->
			<div>
				<label class="block mb-2 text-gray-300">Message</label>
				<!-- <textarea v-model="message" rows="4" class="w-full p-3 bg-gray-900 rounded border border-gray-700" /> -->
				<textarea
					v-if="isFreeText"
					v-model="message"
					name="free text"
					required
					rows="4"
					class="w-full p-3 bg-gray-900 rounded border border-gray-700"
				/>
				<textarea
					v-else
					:value="autoMessage"
					readonly
					rows="4"
					class="w-full p-3 bg-gray-900 rounded border border-gray-700 opacity-70 cursor-not-allowed"
				/>
			</div>
			<!-- Mode Live / Scheduled -->
			<div v-if="channel && notificationType" class="mt-4">
				<label class="block mb-2 text-gray-300">Mode</label>

				<div class="flex items-center gap-4 text-gray-300 pointer-events-none">
					<label class="flex items-center gap-2">
						<input type="radio" value="live" :checked="autoMode === 'live'" />
						Live
					</label>

					<label class="flex items-center gap-2">
						<input type="radio" value="scheduled" :checked="autoMode === 'scheduled'" />
						Scheduled
					</label>
				</div>
			</div>

			<!-- Date + Time if scheduled -->
			<div v-if="mode === 'scheduled'" class="mt-4">
				<label class="block mb-2 text-gray-300">Date & time</label>
				<input
					v-model="scheduledAt"
					type="datetime-local"
					class="w-full p-3 bg-gray-900 rounded border border-gray-700"
				/>
			</div>

			<button class="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded text-white">
				Send notification
			</button>
		</form>
	</div>
</template>

<script lang="ts" setup>
import type { IChannel, INotificationType, NotificationCategory } from "~~/types/custom";

definePageMeta({
	layout: "admin",
});

const { toUtc } = useUtcDate();
const venuesStore = useVenuesStore();
const teamsStore = useTeamsStore();
const notificationsStore = useNotificationsStore();
const gameStore = useGamesStore();

const notificationTypes = {
	// Channel starts with "game_":
	game: [
		/*		{
			label: "Start soon",
			index: 1,
			title: "Game is starting soon",
			template: "The game {{team1}} vs. {{team2}} will start soon on venue {{track}}",
			isScheduled: true,
		}, // scheduled, link to the game
		{
			label: "Started",
			index: 2,
			title: "Game has started",
			template: "The game  {{team1}} vs. {{team2}} has started on venue {{track}}",
			isScheduled: true,
		},*/
		{
			label: "intermission",
			index: 3,
			title: "Intermission",
			template: "{{team1}} {{score1}} - {{score2}} {{team2}}",
			isScheduled: false,
		}, // manual, link to the game --> score
		{
			label: "end of game",
			index: 4,
			title: "End of game",
			template: "Final score: {{team1}} {{score1}} - {{score2}} {{team2}}",
			isScheduled: false,
		}, // manual, link to the game --> score
		{
			label: "late",
			index: 5,
			title: "Late",
			template: "The game is running {{minutes}} minutes late",
			isScheduled: false,
		}, // manual, link to the game - number of minutes late --> propagate to all channel scheduled notifications
	],
	// Channel for on site notices
	local: [
		{ label: "On site info", index: 6, title: "", template: "{{message}}", isScheduled: false }, // manual, link to the app - free text
	],
	// // Channel for global notices
	global: [
		{ label: "Global info", index: 7, title: "", template: "{{message}}", isScheduled: false }, // manual, link to the app - free text
	],
};

const notificationType = ref<INotificationType | null>(null);
const message = ref<string>("");
const channel = ref<IChannel | null>(null);
const mode = ref<"live" | "scheduled">("live"); // 'live' or 'scheduled'
const scheduledAt = ref<string | null>(null);

const score1 = ref<number | null>(null);
const score2 = ref<number | null>(null);

const gameDelay = ref<number | null>(null);

const channels = computed(() => notificationsStore.channels);

const channelType = computed<NotificationCategory | null>(() => {
	return channel.value ? channel.value.type : null;
});

const availableNotificationTypes = computed<INotificationType[]>(() => {
	return channelType.value ? notificationTypes[channelType.value] : [];
});

const isFreeText = computed<boolean>(() => {
	if (!channel.value || !notificationType.value) return false;

	return ["local", "global"].includes(channelType.value!);
});

const autoTitle = computed<string>(() => {
	return notificationType.value?.title ?? "";
});

const autoMode = computed<"live" | "scheduled">(() => {
	return notificationType.value?.isScheduled ? "scheduled" : "live";
});

const currentGame = computed(() => {
	if (!channel.value) return null;
	const id = extractGameId(channel.value.slug);
	return id ? gameStore.getGameById(id) : null;
});

const team1Name = computed(() => {
	const game = currentGame.value;
	if (!game) {
		return "no game found for this channel";
	}

	if (game.home_team == null) {
		return "no home team ID found";
	}

	const team = teamsStore.getTeamById(game.home_team);
	return team?.name ?? `no team found for ID ${game.home_team}`;
});

const team2Name = computed(() => {
	const game = currentGame.value;
	if (!game) {
		return "no game found for this channel";
	}
	if (game.away_team == null) {
		return "no away team ID found";
	}

	const team = teamsStore.getTeamById(game.away_team);
	return team?.name ?? `no team found for ID ${game.away_team}`;
});

const location = computed(() => {
	const game = currentGame.value;
	if (!game) return "no game found";

	const venue = venuesStore.getVenueById(game.venue);
	return venue?.name ?? `no venue found for ID ${game.venue}`;
});

const autoMessage = computed<string>(() => {
	if (!notificationType.value || !channel.value) return "";

	const vars = {
		track: location.value,
		team1: team1Name.value,
		team2: team2Name.value,
		score1: score1.value,
		score2: score2.value,
		minutes: gameDelay.value,
		message: message.value, // for free text
	};

	return applyTemplate(notificationType.value.template, vars);
});

function extractGameId(slug: string): number | null {
	if (!slug.startsWith("game_")) return null;

	const id = Number(slug.slice(5));
	return Number.isFinite(id) ? id : null;
}

function applyTemplate(template: string, vars: Record<string, any>): string {
	return template.replace(/{{(.*?)}}/g, (_, key) => {
		const k = key.trim();
		return vars[k] ?? "";
	});
}

function handleSubmit(e: Event) {
	e.preventDefault();
	const form = e.target as HTMLFormElement;
	if (!form.checkValidity()) return;
	submit();
}

function resetForm() {
	notificationType.value = null;
	message.value = "";
	score1.value = null;
	score2.value = null;
	gameDelay.value = null;
	scheduledAt.value = null;
}

watch(channel, resetForm);

async function submit() {
	await $fetch("/api/notifications/create", {
		method: "POST",
		body: {
			channel_slug: channel.value!.slug,
			title: autoTitle.value,
			body: isFreeText.value ? message.value : autoMessage.value,
			scheduled_at:
				mode.value === "scheduled" && scheduledAt.value ? toUtc(scheduledAt.value) : null,
		},
	});

	message.value = "";
	score1.value = null;
	score2.value = null;
	scheduledAt.value = null;
	gameDelay.value = null;
}

onMounted(async () => {
	await notificationsStore.fetchChannels();
	if (!channel.value && channels.value.length > 0) {
		channel.value = channels.value[0]!;
	}
});
</script>
