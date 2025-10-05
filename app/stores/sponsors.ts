/**
 https://pinia.vuejs.org/core-concepts/#Setup-Stores
 
 In Setup Stores:
 - ref()s become state properties
 - computed()s become getters
 - function()s become actions
 */

import { defineStore } from "pinia";
import type {
  ILocalizedSponsor,
  ISponsor,
  ISponsorsRequestData,
} from "~~/types/custom";

export const useSponsorsStore = defineStore("sponsors", () => {
  const { locale, fallbackLocale } = useI18n();
  const isReady = ref<boolean>(false);
  const sponsors = ref<ISponsor[] | null>(null);

  /**
   * Fetch data from the API.
   */
  async function fetch() {
    try {
      const fields = {
        translations: {
          languages_code: true,
          name: true,
          logo: true,
        },
      };
      const { data } = await $fetch<ISponsorsRequestData>(
        buildRESTURL("sponsors", fields).href
      );
      sponsors.value = data;
      isReady.value = true;
      return data;
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      isReady.value = false;
      sponsors.value = null;
      throw error;
    }
  }

  /**
   * Return an array of localized teams.
   * This getter transforms the raw teams data into a structure suitable for localized display.
   */
  const localizedSponsors = computed((): ILocalizedSponsor[] => {
    if (!sponsors.value) return [];

    return sponsors.value.reduce<ILocalizedSponsor[]>((result, sponsor) => {
      // Get translation from current locale
      let sponsorTranslation = sponsor.translations.find(
        (translation) => translation.languages_code === locale.value
      );
      // If not found, try fallback locale
      if (!sponsorTranslation) {
        sponsorTranslation = sponsor.translations.find(
          (translation) => translation.languages_code === fallbackLocale.value
        );
      }
      // If a translation is found, add the localized sponsor to the result
      if (sponsorTranslation) {
        result.push({
          name: sponsorTranslation.name,
          logo: sponsorTranslation.logo,
        } as ILocalizedSponsor);
      }
      return result;
    }, []);
  });

  // Expose the required properties, getters and actions
  return {
    fetch,
    isReady,
    sponsors, // Make sure to expose this even if we are not using it directly in the components (to prevent hydration mismatches)
    localizedSponsors,
  };
});
