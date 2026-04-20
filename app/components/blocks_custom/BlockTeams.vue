<template>
	<div class="bg-blue-text py-16">
		<div class="maxed padded">
			<!-- MOBILE SWIPER -->

			<div class="sm:hidden">
				<Swiper
					:slides-per-view="1"
					:space-between="12"
					:grab-cursor="true"
					@slide-change="onSlideChange"
				>
					<SwiperSlide v-for="(team, i) in formattedTeams" :key="`team_mobile_${i}`" class="flex">
						<div class="flex flex-col items-center gap-3 w-full">
							<NuxtLink :to="`/teams/${team.slug}`" class="w-2/3">
								<NuxtImg
									:src="`${config.public.apiBase}/assets/${team.logo}?width=300`"
									:alt="team.name"
									:title="team.name"
									class="w-full object-contain cursor-pointer rounded-lg p-2 bg-white"
								/>
							</NuxtLink>

							<div class="text-center min-h-[2.5lh]">
								<p class="text-3xl font-shoulders leading-none">
									{{ team.displayName }}
								</p>
							</div>
						</div>
					</SwiperSlide>
				</Swiper>

				<!-- PAGINATION -->

				<div class="text-center text-white/60 mt-2 text-sm">
					{{ index + 1 }} / {{ formattedTeams.length }}
				</div>
			</div>

			<ul
				class="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center list-none"
			>
				<li v-for="(team, i) in formattedTeams" :key="`team_${i}`">
					<NuxtLink
						:to="`/teams/${team.slug}`"
						class="flex flex-col items-center justify-start gap-3"
					>
						<div
							class="w-full aspect-square flex items-center justify-center bg-white rounded-lg p-2 cursor-pointer hover:scale-105 transition-transform"
						>
							<NuxtImg
								:src="`${config.public.apiBase}/assets/${team.logo}?width=300`"
								:alt="team.name"
								:title="team.name"
								class="w-auto object-contain"
							/>
						</div>
						<div class="flex leading-none min-h-[2.5lh] items-start justify-start text-center">
							<p class="text-xl lg:text-2xl font-shoulders leading-none">
								{{ team.displayName }}
							</p>
						</div>
					</NuxtLink>
				</li>
			</ul>

			<Teleport to="body">
				<Transition
					enter-from-class="opacity-0"
					enter-active-class="transition-opacity duration-200 ease-out"
					enter-to-class="opacity-100"
					leave-from-class="opacity-100"
					leave-active-class="transition-opacity duration-200 ease-in"
					leave-to-class="opacity-0"
				>
					<div
						v-if="overlayLogo"
						class="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center cursor-pointer"
						@click="overlayLogo = null"
					>
						<img
							:src="overlayLogo"
							alt=""
							class="max-w-[75vw] max-h-[80vh] w-auto h-auto object-contain pointer-events-none"
						/>
					</div>
				</Transition>
			</Teleport>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import type { Swiper as SwiperInstance } from "swiper/types";

const teamsStore = useTeamsStore();
const config = useRuntimeConfig();
// import "swiper/css";

const overlayLogo = ref<string | null>(null);

const formattedTeams = computed(() =>
	teamsStore.localizedTeams.map((team) => ({
		...team,

		displayName: team.name.replace(/\broller\s+derby\s*$/i, "Roller\u00A0Derby"),
	}))
);

const index = ref(0);

const onSlideChange = (swiper: SwiperInstance) => {
	index.value = swiper.activeIndex;
};

watch(overlayLogo, (visible) => {
	if (visible) {
		document.body.style.overflow = "hidden";
	} else {
		document.body.style.overflow = "";
	}
});

onUnmounted(() => {
	document.body.style.overflow = "";
});
</script>
