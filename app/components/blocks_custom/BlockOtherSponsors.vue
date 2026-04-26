<template>
	<div class="bg-blue-text mt-32">
		<div class="maxed padded">
			<h2 class="text-center text-2xl font-bold">OTHER SPONSORS</h2>
			<div
				class="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
			>
				<div v-for="(sponsor, i) in sponsorsStore.pageSponsors" :key="`sponsor_${i}`">
					<NuxtLink v-if="sponsor.url" :href="sponsor.url" target="_blank">
						<NuxtImg
							v-if="sponsor.logo"
							:src="`${config.public.apiBase}/assets/${sponsor.logo}`"
							:alt="sponsor.name"
							:title="sponsor.name"
							class="object-contain w-full h-full"
						/>
					</NuxtLink>
					<NuxtImg
						v-else-if="sponsor.logo"
						:src="`${config.public.apiBase}/assets/${sponsor.logo}`"
						:alt="sponsor.name"
						:title="sponsor.name"
						class="object-contain w-full h-full"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const sponsorsStore = useSponsorsStore();
const config = useRuntimeConfig();

onMounted(() => {
	sponsorsStore.fetch();
});
</script>
