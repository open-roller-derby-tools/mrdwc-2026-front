<template>
	<div class="">
		<div class="maxed padded py-8">
			<div class="bg-white text-blue-text rounded-2xl p-6">
				<h2
					class="text-center text-3xl font-bold text-red-text flex items-center gap-2 justify-center mb-6"
				>
					<UIcon name="lucide:heart-handshake" class="size-8" />
					<span> {{ t("other_sponsors") }}</span>
				</h2>
				<div class="flex flex-col sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div v-for="(sponsor, i) in sponsorsStore.pageSponsors" :key="`sponsor_${i}`">
						<NuxtLink
							:href="sponsor.url ?? '#'"
							:target="sponsor.url ? '_blank' : '_self'"
							class="flex flex-col items-center justify-center gap-3"
						>
							<p class="text-2xl font-shoulders font-bold leading-none text-balance">
								{{ sponsor.name }}
							</p>
							<div class="w-full aspect-square">
								<NuxtImg
									v-if="sponsor.logo"
									:src="`${config.public.apiBase}/assets/${sponsor.logo}`"
									:alt="sponsor.name"
									:title="sponsor.name"
									class="object-contain w-full h-full"
								/>
							</div>
						</NuxtLink>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const sponsorsStore = useSponsorsStore();
const config = useRuntimeConfig();
const { t } = useI18n();

onMounted(() => {
	sponsorsStore.fetch();
});
</script>
