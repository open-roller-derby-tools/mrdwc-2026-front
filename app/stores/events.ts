/**
 https://pinia.vuejs.org/core-concepts/#Setup-Stores
 
 In Setup Stores:
 - ref()s become state properties
 - computed()s become getters
 - function()s become actions
 */

import { defineStore } from "pinia";
import type {
  IEvent,
  IEventsRequestData,
  ILocalizedEvent,
} from "~~/types/events";

export const useEventsStore = defineStore("events", () => {
  const { locale, fallbackLocale } = useI18n();
  const isReady = ref<boolean>(false);
  const events = ref<IEvent[] | null>(null);

  /**
   * Fetch data from the API.
   * Skips the network request when data was already loaded
   */
  async function fetch() {
    if (isReady.value && events.value != null) {
      return events.value;
    }
    try {
      const fields = {
        id: true,
        start_time: true,
        end_time: true,
        translations: {
          languages_code: true,
          name: true,
          description: true,
        },
      };
      const { data } = await $fetch<IEventsRequestData>(
        buildRESTURL("events", fields).href,
      );

      // Add the event timezone to the start_time
      data.forEach((event) => {
        event.start_time = event.start_time + "+02:00";
        event.end_time = event.end_time + "+02:00";
      });

      // Sort events by start time.
      const sortedData = [...data].sort((a, b) => {
        const ta = Date.parse(a.start_time);
        const tb = Date.parse(b.start_time);
        const aValid = !Number.isNaN(ta);
        const bValid = !Number.isNaN(tb);

        if (aValid && bValid) {
          if (ta !== tb) return ta - tb;
          // Sort by event id for identical start_time
          return a.id - b.id;
        }
        // Fallback for unexpected date formats.
        return a.id - b.id;
      });

      events.value = sortedData;
      isReady.value = true;
      return sortedData;
    } catch (error) {
      console.error("Error fetching events:", error);
      isReady.value = false;
      events.value = null;
      throw error;
    }
  }

  /**
   * Return an array of localized events.
   * This getter transforms the raw event data into a structure suitable for localized display.
   */
  const localizedEvents = computed((): ILocalizedEvent[] => {
    if (!events.value) return [];

    return events.value.reduce<ILocalizedEvent[]>((result, event) => {
      // Get translation from current locale
      let eventTranslation = event.translations.find(
        (translation) => translation.languages_code === locale.value,
      );
      // If not found, try fallback locale
      if (!eventTranslation) {
        eventTranslation = event.translations.find(
          (translation) => translation.languages_code === fallbackLocale.value,
        );
      }
      // If a translation is found, add the localized application to the result
      if (eventTranslation) {
        result.push({
          id: event.id,
          start_time: event.start_time,
          end_time: event.end_time,
          name: eventTranslation.name,
          description: eventTranslation.description,
        } as ILocalizedEvent);
      }
      return result;
    }, []);
  });

  // Expose the required properties, getters and actions
  return {
    fetch,
    isReady,
    events, // Make sure to expose this even if we are not using it directly in the components (to prevent hydration mismatches)
    localizedEvents,
  };
});
