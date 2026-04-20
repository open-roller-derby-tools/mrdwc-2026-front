<template>
	<div class="bg-blue-text text-base sm:text-lg">
		<div class="maxed padded">
			<ul class="list-none">
				<li v-for="(venue, index) in venuesStore.venues" :key="venue.id" class="leading-tight">
					<span class="font-shoulders font-bold text-lg mr-1">
						{{
							t("calendar_track_short", {
								index: index + 1,
								count: 2,
							})
						}}</span
					>
					<a :href="venue.map_url" target="_blank" class="">
						<span class="font-bold text-yellow">{{ venue.name }}</span>
						<span class="hidden italic ml-2">{{ venue.address }}</span></a
					>
				</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useVenuesStore } from "~/stores/venues";

const { t } = useI18n();
const venuesStore = useVenuesStore();
</script>
