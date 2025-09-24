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
  const { locale } = useI18n();

  const pending = ref<boolean>(true);
  const teams = ref<ITeam[]>();

  /**
   * Fetch teams data from the API.
   */
  async function fetch() {
    pending.value = true;

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
    pending.value = false;
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
          const trans = member.translations.find((translation) => {
            return translation.languages_code === locale.value;
          });
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
  return { fetch, pending, teams, localizedTeams };
});
