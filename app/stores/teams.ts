/**
 https://pinia.vuejs.org/core-concepts/#Setup-Stores
 
 In Setup Stores:
 - ref()s become state properties
 - computed()s become getters
 - function()s become actions
 */

import { defineStore } from "pinia";
import type { Team } from "~~/types/custom";

export const useTeamsStore = defineStore("teams", () => {
  // const { locale } = useI18n();

  const pending = ref<boolean>(true);
  const teams = ref<Team[]>();

  async function fetch() {
    // TODO: Write a method for building fetch URLs from a list of requested fields
    const { data } = await $fetch(
      "https://ordwc.infinitespace.click/items/teams?fields=name,members.name,members.number,members.translations.pronouns,members.translations.languages_code"
    );
    teams.value = data;
    pending.value = false;
  }

  // TODO: Getter function using locale to filter translations

  return { fetch, pending, teams };
});
