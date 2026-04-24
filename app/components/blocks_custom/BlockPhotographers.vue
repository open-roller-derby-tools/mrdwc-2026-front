<template>
	<div class="bg-blue-text py-8 sm:py-16">
		<div class="maxed padded">
			<div
				class="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
			>
				<div v-for="(photographer, i) in photographers" :key="`photographer_${i}`">
					<div
						class="flex flex-row items-stretch sm:flex-col sm:items-center sm:gap-5 w-full h-full"
					>
						<!-- VISUAL -->
						<div class="w-[100px] sm:w-full flex-shrink-0">
							<div
								class="relative aspect-square flex bg-blue-inactive items-center justify-center rounded-tl-lg sm:rounded-lg border-x border-t sm:border border-white/30 overflow-hidden"
							>
								<!-- Logo -->
								<NuxtImg
									v-if="photographer.logo"
									:src="`${config.public.apiBase}/assets/${photographer.logo}`"
									:alt="photographer.name"
									class="object-contain w-full h-full"
								/>

								<!-- Avatar -->
								<NuxtImg
									v-else-if="photographer.avatar"
									:src="`${config.public.apiBase}/assets/${photographer.avatar}`"
									:alt="photographer.name"
									class="object-cover w-full h-full"
								/>

								<!-- Fallback -->
								<div v-else class="flex items-center justify-center text-white/60">
									<Icon name="lucide:camera" class="w-12 h-12" />
								</div>

								<!-- 📸 Crédit overlay -->
								<div
									v-if="photographer.photo_credits"
									class="absolute bottom-0 left-0 right-0 px-2 py-1 text-[10px] text-white/70 bg-gradient-to-t from-black/70 to-transparent"
								>
									© {{ photographer.photo_credits }}
								</div>
							</div>
						</div>

						<!-- INFOS -->
						<div
							class="flex flex-col flex-1 border-t border-r border-white/40 sm:border-0 pl-4 sm:p-0 sm:items-center gap-3 py-3 sm:py-0 bg-white/10 sm:bg-transparent rounded-tr-xl h-[100px] sm:h-auto sm:mb-5"
						>
							<p
								class="text-2xl sm:text-xl lg:text-2xl font-shoulders text-white leading-7 text-left sm:text-center"
							>
								{{ photographer.name }}
							</p>

							<p v-if="photographer.pronouns" class="text-xs text-white/60">
								{{ photographer.pronouns }}
							</p>

							<!-- 🔗 Bouton -->
							<a
								v-if="photographer.portfolio"
								:href="photographer.portfolio ?? undefined"
								target="_blank"
								rel="noopener noreferrer"
								class="hidden sm:inline-flex mt-auto items-center w-full justify-center gap-2 pl-2 pr-3 py-2 text-xs font-semibold text-black bg-yellow border border-yellow rounded-md hover:bg-red-200 hover:border-red-light hover:text-red-light transition"
							>
								<Icon name="lucide:eye" class="w-4 h-4 group-hover:scale-125" />
								{{ t("photographers.discoverWork") }}
							</a>
						</div>
					</div>
					<a
						v-if="photographer.portfolio"
						:href="photographer.portfolio ?? undefined"
						target="_blank"
						rel="noopener noreferrer"
						class="sm:hidden w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-black bg-yellow border border-yellow rounded-b-md hover:bg-red-200 hover:border-red-light hover:text-red-light transition"
					>
						<Icon name="lucide:eye" class="w-4 h-4" />
						{{ t("photographers.discoverWork") }}
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig();
const photographersStore = usePhotographersStore();

const { t } = useI18n();

onMounted(() => {
	if (!photographersStore.isReady) {
		photographersStore.fetch();
	}
});

const photographers = computed(() => photographersStore.photographers ?? []);
</script>
