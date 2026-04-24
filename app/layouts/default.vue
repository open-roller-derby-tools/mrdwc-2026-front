<template>
	<UApp>
		<div class="min-h-dvh flex flex-col pb-12 sm:pb-0">
			<HeaderNav />
			<slot />
			<Footer />
			<SettingsDrawer />
		</div>
	</UApp>
</template>

<script lang="ts" setup>
import HeaderNav from "~/components/navigation/HeaderNav.vue";
import SettingsDrawer from "~/components/navigation/SettingsDrawer.vue";

import { useMenusStore } from "~/stores/menus";
import { usePagesStore } from "~/stores/pages";
import { useSponsorsStore } from "~/stores/sponsors";
import { useVenuesStore } from "~/stores/venues";
import { useApplicationsStore } from "~/stores/applications";
import { useOptionsStore } from "~/stores/options";
import { useTeamsStore } from "~/stores/teams";
import { useOfficialsStore } from "~/stores/officials";

const menusStore = useMenusStore();
const pagesStore = usePagesStore();
const sponsorsStore = useSponsorsStore();
const venuesStore = useVenuesStore();
const applicationsStore = useApplicationsStore();
const optionsStore = useOptionsStore();
const teamsStore = useTeamsStore();
const officialsStore = useOfficialsStore();

// Only fetch from API on the server (SSR or when running `nuxt generate`).
// On the client, data comes from the static payload (when serving the static output).
if (!import.meta.client) {
	await callOnce(menusStore.fetch);
	await callOnce(pagesStore.fetch);
	await callOnce(sponsorsStore.fetch);
	await callOnce(venuesStore.fetch);
	await callOnce(applicationsStore.fetch);
	await callOnce(optionsStore.fetch);
	await callOnce(teamsStore.fetch);
	await callOnce(officialsStore.fetch);

	// Prerender every [slug] page (default locale + en-US) IF the page is set to static.
	// Without this, only crawler-discovered routes are generated.
	if (import.meta.prerender && pagesStore.pages?.length) {
		const staticSlugs = pagesStore.pages.filter((p) => p.slug && p.is_static).map((p) => p.slug);
		const locales = ["en-US"]; // default locale (fr-FR) has no prefix
		const routes = staticSlugs.flatMap((slug) => [
			`/${slug}`,
			...locales.map((locale) => `/${locale}/${slug}`),
		]);
		prerenderRoutes(routes);
	}
}
</script>

<style></style>
