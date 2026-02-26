/**
 https://pinia.vuejs.org/core-concepts/#Setup-Stores
 
 In Setup Stores:
 - ref()s become state properties
 - computed()s become getters
 - function()s become actions
 */

import { defineStore } from "pinia";
import type {
  IApplication,
  IApplicationsRequestData,
  ILocalizedApplication,
} from "~~/types/custom";

export const useApplicationsStore = defineStore("applications", () => {
  const { locale, fallbackLocale } = useI18n();
  const isReady = ref<boolean>(false);
  const applications = ref<IApplication[] | null>(null);

  /**
   * Fetch data from the API.
   * Skips the network request when data was already loaded
   */
  async function fetch() {
    if (isReady.value && applications.value != null) {
      return applications.value;
    }
    try {
      const fields = {
        status: true,
        anchor_id: true,
        translations: {
          languages_code: true,
          name: true,
          description: true,
          dates: true,
        },
      };
      const { data } = await $fetch<IApplicationsRequestData>(
        buildRESTURL("applications", fields).href
      );
      applications.value = data;
      isReady.value = true;
      return data;
    } catch (error) {
      console.error("Error fetching applications:", error);
      isReady.value = false;
      applications.value = null;
      throw error;
    }
  }

  /**
   * Return an array of localized application.
   * This getter transforms the raw application data into a structure suitable for localized display.
   */
  const localizedApplications = computed((): ILocalizedApplication[] => {
    if (!applications.value) return [];

    return applications.value.reduce<ILocalizedApplication[]>(
      (result, application) => {
        // Get translation from current locale
        let applicationTranslation = application.translations.find(
          (translation) => translation.languages_code === locale.value
        );
        // If not found, try fallback locale
        if (!applicationTranslation) {
          applicationTranslation = application.translations.find(
            (translation) => translation.languages_code === fallbackLocale.value
          );
        }
        // If a translation is found, add the localized application to the result
        if (applicationTranslation) {
          result.push({
            status: application.status,
            anchor_id: application.anchor_id,
            name: applicationTranslation.name,
            description: applicationTranslation.description,
            dates: applicationTranslation.dates,
          } as ILocalizedApplication);
        }
        return result;
      },
      []
    );
  });

  const getApplicationsWithStatus = computed(() => {
    return (
      statuses: ("upcoming" | "open" | "closed")[]
    ): ILocalizedApplication[] => {
      return localizedApplications.value.filter((application) =>
        statuses.includes(application.status)
      );
    };
  });

  // Expose the required properties, getters and actions
  return {
    fetch,
    isReady,
    applications, // Make sure to expose this even if we are not using it directly in the components (to prevent hydration mismatches)
    localizedApplications,
    getApplicationsWithStatus,
  };
});
