/**
 https://pinia.vuejs.org/core-concepts/#Setup-Stores
 
 In Setup Stores:
 - ref()s become state properties
 - computed()s become getters
 - function()s become actions
 */

import { defineStore } from "pinia";
import type {
  ILocalizedVenue,
  IVenue,
  IVenuesRequestData,
} from "~~/types/custom";

export const useVenuesStore = defineStore("venues", () => {
  const isReady = ref<boolean>(false);
  const venues = ref<IVenue[] | null>(null);

  /**
   * Fetch data from the API.
   */
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
      venues.value = null;
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
  return {
    fetch,
    isReady,
    venues, // Make sure to expose this even if we are not using it directly in the components (to prevent hydration mismatches)
    localizedVenues,
  };
});
