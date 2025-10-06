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
  const isReady = ref(false);
  const venues = ref<ILocalizedVenue[]>([]);

  async function fetch() {
    try {
      const fields = {
        name: true,
        type: true,
        address: true,
        map_url: true,
        image: true,
      };
      const { data } = await $fetch<IVenuesRequestData>(
        buildRESTURL("venues", fields).href
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
    return venues.value.map<ILocalizedVenue>(
      (venue) => venue as ILocalizedVenue
    );
  });

  // Expose the required properties, getters and actions

  return { fetch, isReady, venues, localizedVenues };
});
