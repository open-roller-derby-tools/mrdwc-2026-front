<template>
	<div class="bg-blue-text py-16">
		<div class="maxed padded">
			<div
				class="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
			>
				<div v-for="(team, i) in formattedTeams" :key="`team_${i}`">
					<NuxtLinkLocale
						:to="`/announcers/teams/${team.slug}`"
						class="flex flex-row items-stretch h-[100px] sm:h-auto sm:flex-col sm:items-center justify-start sm:gap-4 sm:mb-6 w-full"
					>
						<div
							class="w-[100px] h-full flex-shrink-0 sm:w-full aspect-square flex bg-white items-center justify-center rounded-l-lg sm:rounded-lg p-2 cursor-pointer hover:scale-105 transition-transform"
						>
							<NuxtImg
								:src="`${config.public.apiBase}/assets/${team.logo}?width=300`"
								:alt="team.name"
								:title="team.name"
								class="object-contain min-w-[90px] w-full"
							/>
						</div>

						<div
							class="flex flex-col flex-1 border-y border-r border-white/40 sm:border-0 pl-4 sm:p-0 leading-none sm:items-center justify-center sm:justify-start h-full gap-2 py-2 sm:py-0 bg-white/10 sm:bg-transparent rounded-e-xl"
						>
							<p
								class="text-2xl sm:text-xl lg:text-2xl font-shoulders text-white leading-7 text-left sm:text-center"
							>
								{{ team.displayName }}
							</p>
						</div>
					</NuxtLinkLocale>
				</div>
			</div>

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
definePageMeta({
	layout: "announcers",
});

const teamsStore = useTeamsStore();
const config = useRuntimeConfig();

const overlayLogo = ref<string | null>(null);

const formattedTeams = computed(() =>
	teamsStore.localizedTeams.map((team) => ({
		...team,

		displayName: team.name.replace(/\broller\s+derby\s*$/i, "Roller\u00A0Derby"),
	}))
);

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
