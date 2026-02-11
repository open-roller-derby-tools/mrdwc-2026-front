/**
 https://pinia.vuejs.org/core-concepts/#Setup-Stores
 
 In Setup Stores:
 - ref()s become state properties
 - computed()s become getters
 - function()s become actions
 */

import { defineStore } from "pinia";
import type {
  ILocalizedTeam,
  ILocalizedTeamMember,
  ITeam,
  ITeamMember,
  ITeamsRequestData,
} from "~~/types/custom";

export const useTeamsStore = defineStore("teams", () => {
  const { locale, fallbackLocale } = useI18n();

  const isReady = ref<boolean>(false);
  const teams = ref<ITeam[]>();

  /**
   * Fetch data from the API.
   * Skips the network request when data was already loaded (e.g. from a previous call during the same server run).
   */
  async function fetch() {
    if (isReady.value && teams.value != null) {
      return teams.value;
    }
    try {
      const fields = {
        name: true,
        members: {
          name: true,
          number: true,
          translations: {
            languages_code: true,
            pronouns: true,
          },
        },
      };
      const { data } = await $fetch<ITeamsRequestData>(
        buildRESTURL("teams", fields).href
      );

      teams.value = data;
      isReady.value = true;
      return data;
    } catch (error) {
      console.error("Error fetching teams:", error);
      isReady.value = false;
      throw error;
    }
  }

  /**
   * Return an array of localized teams.
   * This getter transforms the raw teams data into a structure suitable for localized display.
   */
  const localizedTeams = computed((): ILocalizedTeam[] => {
    const list: ILocalizedTeam[] = [];

    teams.value?.forEach((team: ITeam) => {
      let l_team: ILocalizedTeam = {
        id: team.id,
        name: team.name,
        members: [],
      };

      team.members.forEach((member: number | ITeamMember) => {
        if (typeof member === "number") {
          (l_team.members as number[]).push(member);
        } else {
          let l_member: ILocalizedTeamMember = {
            id: member.id,
            team: member.team,
            name: member.name,
            number: member.number,
            role: member.role,
            pronouns: "",
          };
          let trans = member.translations.find((translation) => {
            return translation.languages_code === locale.value;
          });
          if (!trans) {
            trans = member.translations.find((translation) => {
              return translation.languages_code === fallbackLocale.value;
            });
          }
          l_member.pronouns = trans?.pronouns ?? "";
          (l_team.members as ILocalizedTeamMember[]).push(l_member);
        }
      });

      list.push(l_team);
    });

    return list;
  });

  /**
   * Expose the required properties, getters and actions
   */
  return { fetch, isReady, teams, localizedTeams };
});
