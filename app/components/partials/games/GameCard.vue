<template>
	<div
		class="rounded-2xl bg-white p-4 sm:p-6 text-black shadow-2xl flex flex-col gap-4"
		:class="wrapperClass"
	>
		<!-- Teams/scores -->
		<GameCardVersus :game="game" />
		<!-- Other infos -->
		<div class="space-y-2">
			<!-- Date/time + state -->
			<div class="flex items-center justify-between gap-2 text-lg">
				<p class="first-letter:uppercase leading-none">
					{{ formatDateTime(game.start_time) }}
				</p>
				<p class="leading-none">
					<GameStateLabel
						:game="game"
						:with-background="false"
						:show-time="false"
						class="!text-lg"
					/>
				</p>
			</div>
			<!-- Duration + type -->
			<div class="flex items-center justify-between gap-2 text-lg">
				<p class="leading-none">
					{{ t(`game_duration.${game.duration}`) }}
				</p>
				<p class="italic leading-none">{{ t(`game_type.${game.type}`) }}</p>
			</div>
			<a v-if="venue" :href="venue.map_url" target="_blank" class="text-lg font-bold leading-none">
				<span class="font-shoulders">
					{{ t("calendar_track_short", { index: venue.sort, count: 2 }) }}
				</span>
				<span class="text-blue-text ml-1">{{ venue.name }}</span>
			</a>
		</div>
		<!-- Buttons -->
		<div v-if="mode === 'card'" class="flex gap-2 flex-col sm:flex-row">
			<!-- Watch live button -->
			<NuxtLinkLocale
				v-if="isGameInProgress(game)"
				:to="`/live#track-${game.venue}`"
				class="button--red flex-1"
				><span>{{ t("watch_live") }}</span>
				<div class="relative inline-flex">
					<UIcon
						name="ic:round-fiber-manual-record"
						class="absolute size-5 opacity-75 animate-ping"
					/>
					<UIcon name="ic:round-fiber-manual-record" class="size-5" />
				</div>
			</NuxtLinkLocale>
			<!-- Watch replay button -->
			<NuxtLinkLocale
				v-if="game.state === GameState.Finished && game.video_url"
				:to="`/games/${game.number}`"
				class="button--red flex-1"
				><span>{{ t("watch_replay") }}</span
				><UIcon name="ic:round-smart-display" class="size-6"
			/></NuxtLinkLocale>
			<!-- Go to game page button -->
			<NuxtLinkLocale :to="`/games/${game.number}`" class="button--yellow flex-1"
				><span>{{ t("game_page") }}</span> <UIcon name="lucide:arrow-right" class="size-6"
			/></NuxtLinkLocale>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { GameState, type IGame } from "~~/types/games";
import { isGameInProgress } from "~/utils/game";
import { useVenuesStore } from "~/stores/venues";

import GameCardVersus from "./GameCardVersus.vue";
import GameStateLabel from "./GameStateLabel.vue";

const venuesStore = useVenuesStore();
const { formatDateTime } = useFormatTimeLocalized();
const { t } = useI18n();

const props = defineProps<{
	game: IGame;
	mode: "card" | "page";
}>();

const venue = computed(() => venuesStore.getVenueById(props.game.venue));

const wrapperClass = computed(() => {
	return props.mode === "card" ? "w-xl max-w-full mx-auto" : "w-full";
});
</script>
