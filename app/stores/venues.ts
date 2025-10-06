/**
 https://pinia.vuejs.org/core-concepts/#Setup-Stores
 
 In Setup Stores:
 - ref()s become state properties
 - computed()s become getters
 - function()s become actions
 */

import { defineStore } from "pinia"
import type {
  ILocalizedVenue,
  IVenue,
  IVenuesRequestData,
} from "~~/types/custom"

/**
 * Fetch data from the API.
 */
export const useVenuesStore = defineStore("venues", () => {
  const config = useRuntimeConfig()
  const isReady = ref(false)
  const venues = ref<ILocalizedVenue[]>([])

  async function fetch() {
    try {
      const fields = "name,type,address,map_url,image.id,image.filename_disk"
      const { data } = await $fetch<IVenuesRequestData>(
        `${config.public.apiBase}/items/venues?fields=${fields}`
      )

      venues.value = data.map((venue) => ({
        ...venue,
        imageUrl: venue.image
          ? `${config.public.apiBase}/assets/${venue.image.filename_disk}`
          : undefined,
      }))

      isReady.value = true
      return venues.value
    } catch (error) {
      console.error("Error fetching venues:", error)
      isReady.value = false
      venues.value = []
      throw error
    }
  }

  /**
   * Return an array of localized venues.
   * This getter does nothing but recasting the values from IVenue to ILocalizedVenue, since there is no translation
   */
  const localizedVenues = computed(() => venues.value)

  // Expose the required properties, getters and actions

  return { fetch, isReady, venues, localizedVenues }
})
