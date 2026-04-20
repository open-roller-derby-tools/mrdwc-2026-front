/**
 https://pinia.vuejs.org/core-concepts/#Setup-Stores
 
 In Setup Stores:
 - ref()s become state properties
 - computed()s become getters
 - function()s become actions
 */

import { defineStore } from "pinia";
import type { ILocalizedVenue, IVenuesRequestData } from "~~/types/custom";

/**
 * Fetch data from the API.
 */
export const useVenuesStore = defineStore("venues", () => {
	const {
		public: { apiBase },
	} = useRuntimeConfig();
	const isReady = ref(false);
	const venues = ref<ILocalizedVenue[]>([]);

	async function fetch() {
		if (isReady.value && venues.value != null) {
			return venues.value;
		}
		try {
			const fields = {
				id: true,
				name: true,
				type: true,
				address: true,
				map_url: true,
				image: true,
				sort: true,
			};
			const { data } = await $fetch<IVenuesRequestData>(
				buildRESTURL(apiBase, "venues", fields).href
			);
			venues.value = data;
			isReady.value = true;
			return data;
		} catch (error) {
			console.error("Error fetching venues:", error);
			isReady.value = false;
			venues.value = [];
			throw error;
		}
	}

	/**
	 * Return an array of localized venues.
	 * This getter does nothing but recasting the values from IVenue to ILocalizedVenue, since there is no translation
	 */
	const localizedVenues = computed((): ILocalizedVenue[] => {
		if (!venues.value) return [];
		return venues.value.map<ILocalizedVenue>((venue) => venue as ILocalizedVenue);
	});

	function getVenueById(id: number): ILocalizedVenue | null {
		return localizedVenues.value?.find((venue) => venue.id === id) ?? null;
	}

	// Expose the required properties, getters and actions

	return { fetch, isReady, venues, localizedVenues, getVenueById };
});
