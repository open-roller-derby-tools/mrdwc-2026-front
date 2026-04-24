<template>
	<div class="bg-blue-text py-8 sm:py-16">
		<div class="maxed padded">
			<div
				class="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
			>
				<div v-for="(announcer, i) in announcers" :key="`announcer_${i}`">
					<div
						class="flex flex-row items-stretch group h-[100px] sm:h-auto sm:flex-col sm:items-center justify-start sm:gap-4 sm:mb-6 w-full relative"
						@click="
							announcer.avatar &&
							(overlayAvatar = `${config.public.apiBase}/assets/${announcer.avatar}`)
						"
					>
						<!-- Avatar wrapper (needed for absolute positioning) -->
						<div
							class="relative w-[100px] h-full sm:w-full aspect-square flex cursor-pointer transition-transform sm:group-hover:scale-105"
						>
							<!-- Avatar -->
							<div
								class="w-full h-full flex bg-blue-inactive items-center justify-center rounded-l-lg sm:rounded-lg border border-white/30 overflow-hidden"
							>
								<NuxtImg
									v-if="announcer.avatar"
									:src="`${config.public.apiBase}/assets/${announcer.avatar}`"
									:alt="announcer.name"
									:title="announcer.name"
									class="object-cover w-full h-full"
								/>
								<div v-else class="text-blue-text text-sm text-center px-2">No photo</div>
							</div>

							<!-- 🏳️ FLAGS (DESKTOP OVERLAY) -->
							<div
								v-if="announcer.nationalities"
								class="hidden sm:flex absolute bottom-2 right-2 gap-2 z-10"
							>
								<template v-for="code in getNationalityCodes(announcer.nationalities)" :key="code">
									<img
										v-if="code === 'hawaii'"
										src="/flags/Kanaka_Maoli_flag.svg"
										class="w-[34px] h-auto rounded-xs shadow-[0_0_0_1px_rgba(255,255,255,0.7)]"
									/>

									<span
										v-else
										:class="`fi fi-${code}`"
										class="inline-block text-[20px] rounded-xs shadow-[0_0_0_1px_rgba(255,255,255,0.7)]"
									/>
								</template>
							</div>
						</div>

						<!-- Infos -->
						<div
							class="flex flex-col flex-1 border-y border-r border-white/40 sm:border-0 pl-4 sm:p-0 leading-none sm:items-center justify-center sm:justify-start h-full gap-1 py-2 sm:py-0 bg-white/10 sm:bg-transparent rounded-e-xl relative"
						>
							<!-- 🏳️ FLAGS (MOBILE) -->

							<div v-if="announcer.nationalities" class="flex sm:hidden gap-2 z-10 mb-2">
								<template v-for="code in getNationalityCodes(announcer.nationalities)" :key="code">
									<img
										v-if="code === 'hawaii'"
										src="/flags/Kanaka_Maoli_flag.svg"
										class="w-[25px] h-auto rounded-xs shadow-[0_0_0_1px_rgba(255,255,255,0.7)]"
									/>

									<span
										v-else
										:class="`fi fi-${code}`"
										class="inline-block text-[17px] rounded-xs shadow-[0_0_0_1px_rgba(255,255,255,0.7)]"
									/>
								</template>
							</div>
							<p
								class="text-2xl sm:text-xl lg:text-2xl font-shoulders text-white leading-7 text:left sm:text-center"
							>
								{{ announcer.name }}
							</p>

							<p v-if="announcer.pronouns" class="text-xs text-white/60">
								{{ announcer.pronouns }}
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Overlay -->
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
						v-if="overlayAvatar"
						class="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center cursor-pointer"
						@click="overlayAvatar = null"
					>
						<img
							:src="overlayAvatar"
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
const config = useRuntimeConfig();
const announcersStore = useAnnouncersStore();

const overlayAvatar = ref<string | null>(null);

onMounted(() => {
	if (!announcersStore.isReady) {
		announcersStore.fetch();
	}
});

const announcers = computed(() => announcersStore.announcers ?? []);

const nationalityToCode: Record<string, string> = {
	irish: "ie",
	french: "fr",
	english: "gb",
	american: "us",
	canadian: "ca",
	australian: "au",
	german: "de",
	spanish: "es",
	italian: "it",
	scottish: "gb-sct",
	swedish: "se",
	mexican: "mx",
	jamaican: "jm",
	belgian: "be",
	thai: "th",
	welsh: "gb-wls",
	newzealand: "nz",
	newzealander: "nz",
	puertorican: "pr",
	puerto: "pr",

	hawaiian: "hawaii",
};

const normalizeNationality = (n: string) =>
	n
		.toLowerCase()
		.replace(/\(.*?\)/g, "")
		.replace(/\s+/g, "")
		.trim();

const getNationalityCodes = (nationalities?: string): string[] => {
	if (!nationalities) return [];

	return nationalities
		.split("/")
		.map(normalizeNationality)
		.map((n) => nationalityToCode[n])
		.filter((code): code is string => Boolean(code));
};

// lock scroll quand overlay
watch(overlayAvatar, (visible) => {
	document.body.style.overflow = visible ? "hidden" : "";
});

onUnmounted(() => {
	document.body.style.overflow = "";
});
</script>
