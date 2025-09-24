/**
 https://pinia.vuejs.org/core-concepts/#Setup-Stores
 
 In Setup Stores:
 - ref()s become state properties
 - computed()s become getters
 - function()s become actions
 */

import { defineStore } from "pinia";
import type { Schema, Team, TeamMember } from "~~/types/custom";

export const useTeamsStore = defineStore("teams", () => {
  // const { $directus, $readItems } = useNuxtApp();
  // const { locale } = useI18n();

  const name = ref<string>("");
  const description = ref<string>("");
  const teams = ref<Team[]>();
  const pending = ref<boolean>(true);

  async function fetch() {
    const { data } = await $fetch(
      "https://ordwc.infinitespace.click/items/teams?fields=name,members.name,members.number,members.translations.pronouns,members.translations.languages_code"
    );

    /* const data = await $directus.request(
      $readItems("teams", {
        limit: 99,
        offset: 0,
        fields: [
          "name",
          {
            members: [
              "name",
              "number",
              {
                translations: ["languages_code", "pronouns"],
              },
            ],
          },
        ],
      })
    ); */
    teams.value = data;
    pending.value = false;
  }

  return { fetch, pending, name, description, teams };
});
