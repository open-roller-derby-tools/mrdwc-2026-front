/**
 https://pinia.vuejs.org/core-concepts/#Setup-Stores
 
 In Setup Stores:
 - ref()s become state properties
 - computed()s become getters
 - function()s become actions
 */

import { defineStore } from "pinia";
import type { IOptions, IOptionsRequestData } from "~~/types/custom";

export const useOptionsStore = defineStore("options", () => {
  const { locale, fallbackLocale } = useI18n();
  const isReady = ref<boolean>(false);
  const options = ref<IOptions | null>(null);

  /**
   * Fetch data from the API.
   * Skips the network request when data was already loaded
   */
  async function fetch() {
    if (isReady.value && options.value != null) {
      return options.value;
    }
    try {
      const fields = {
        applications_page: {
          slug: true,
        },
      };
      const { data } = await $fetch<IOptionsRequestData>(
        buildRESTURL("options", fields).href
      );
      options.value = data;
      isReady.value = true;
      return data;
    } catch (error) {
      console.error("Error fetching options:", error);
      isReady.value = false;
      options.value = null;
      throw error;
    }
  }

  // Expose the required properties, getters and actions
  return {
    fetch,
    isReady,
    options,
  };
});
