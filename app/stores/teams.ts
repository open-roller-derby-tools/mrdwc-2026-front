/**
 https://pinia.vuejs.org/core-concepts/#Setup-Stores
 
 In Setup Stores:
 - ref()s become state properties
 - computed()s become getters
 - function()s become actions
 */

type ITeamMembersRequestData = {
  data: ITeamMember[];
};

type IChartersRequestData = {
  data: ICharter[];
};

type ITeamWithRelations = ITeam & {
  members: ITeamMember[];
  charter: ITeamMember[];
};

import { defineStore } from "pinia";
import type {
  ITeamsRequestData,
  ITeam,
  ILocalizedTeam,
  ITeamMember,
  ILocalizedTeamMember,
  ICharter,
} from "~~/types/custom";

export const useTeamsStore = defineStore("teams", () => {
  const { locale, fallbackLocale } = useI18n();

  const isReady = ref<boolean>(false);
  const teams = ref<ITeamWithRelations[]>();

  const slugify = (str: string) =>
    str
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") ?? "";

  const getAssetId = (file: any): string | null => {
    if (!file) return null;
    if (typeof file === "string") return file;
    if (typeof file === "object" && file.id) return file.id;
    return null;
  };

  /**
   * Fetch data from the API.
   * Skips the network request when data was already loaded (e.g. from a previous call during the same server run).
   */
  async function fetch() {
    if (isReady.value && teams.value) return teams.value;

    try {
      const teamFields = {
        id: true,
        name: true,
        logo: true,
        Instagram: true,
        Facebook: true,
        Website: true,
        Crowdfunding: true,
        countries_represented: true,
        previous_participations: true,
        team_history: true,
        team_anecdotes: true,
        name_letters: true,
      };

      const memberFields = {
        id: true,
        team: true,
        firstname: true,
        lastname: true,
        derbyname: true,
        number: true,
        roles: true,
        roster_photo: true,
        pronouns: true,
        member_information: true,
        leagues_represented: true,
        charter_skater_id: true,
        translations: {
          languages_code: true,
          pronouns: true,
        },
      };

      const charterFields = {
        id: true,
        team: true,
      };

      const [teamsRes, membersRes, chartersRes] = await Promise.all([
        $fetch<ITeamsRequestData>(buildRESTURL("teams", teamFields).href),
        $fetch<ITeamMembersRequestData>(
          buildRESTURL("team_members", memberFields, { limit: -1 }).href,
        ),
        $fetch<IChartersRequestData>(
          buildRESTURL("charter", charterFields).href,
        ),
      ]);

      const rawTeams = teamsRes.data;
      const rawMembers = membersRes.data;
      const rawCharters = chartersRes.data;

      const teamsWithRelations = rawTeams.map((team) => {
        // MEMBERS TEAM
        const members = rawMembers.filter((m) => {
          const teamId = typeof m.team === "object" ? m.team?.id : m.team;
          return Number(teamId) === Number(team.id);
        });

        // CHARTER ENTITY
        const charter = rawCharters.find(
          (c) => Number(c.team) === Number(team.id),
        );

        // MEMBERS IN CHARTER
        const charterMembers = charter
          ? members.filter(
              (m) => Number(m.charter_skater_id) === Number(charter.id),
            )
          : [];

        return {
          ...team,
          members,
          charter: charterMembers,
        };
      });

      teams.value = teamsWithRelations.sort((a, b) =>
        (a.name ?? "").localeCompare(b.name ?? "", undefined, {
          sensitivity: "base",
        }),
      );

      isReady.value = true;
      console.log("teams", teams.value);

      return teams.value;
    } catch (error) {
      console.error("Error fetching teams:", error);
      isReady.value = false;
      throw error;
    }
  }

  const localizeMember = (member: ITeamMember): ILocalizedTeamMember => {
    const translations = member.translations ?? [];

    const translation =
      translations.find((t) => t.languages_code === locale.value) ||
      translations.find((t) => t.languages_code === fallbackLocale.value);

    return {
      id: member.id,
      team: member.team,
      firstname: member.firstname,
      lastname: member.lastname,
      derbyname: member.derbyname,
      number: member.number,
      roles: member.roles,
      rosterPhoto: getAssetId(member.roster_photo) ?? "",
      pronouns: translation?.pronouns ?? member.pronouns ?? "",
      memberInformation: member.member_information,
      leaguesRepresented: member.leagues_represented,
      charterSkaterId: member.charter_skater_id,
      translations,
    };
  };

  /**
   * Return an array of localized teams.
   * This getter transforms the raw teams data into a structure suitable for localized display.
   */
  // const localizedTeams = computed((): ILocalizedTeam[] => {
  //   const list: ILocalizedTeam[] = [];

  //   teams.value?.forEach((team: ITeam) => {
  //     let l_team: ILocalizedTeam = {
  //       id: team.id,
  //       slug: slugify(team.name),
  //       name: team.name,
  //       logo: team.logo,
  //       instagram: team.Instagram,
  //       facebook: team.Facebook,
  //       website: team.Website,
  //       crowdfunding: team.Crowdfunding,
  //       countriesRepresented: team.countries_represented,
  //       history: team.team_history,
  //       anecdotes: team.team_anecdotes,
  //       nameLetters: team.name_letters,
  //       previousParticipations: team.previous_participations,
  //       members: [],
  //     };

  //     // team.members.forEach((member: number | ITeamMember) => {
  //     //   if (typeof member === "number") {
  //     //     (l_team.members as number[]).push(member);
  //     //   } else {
  //     //     let l_member: ILocalizedTeamMember = {
  //     //       id: member.id,
  //     //       team: member.team,
  //     //       name: member.name,
  //     //       number: member.number,
  //     //       role: member.role,
  //     //       pronouns: "",
  //     //     };
  //     //     let trans = member.translations.find((translation) => {
  //     //       return translation.languages_code === locale.value;
  //     //     });
  //     //     if (!trans) {
  //     //       trans = member.translations.find((translation) => {
  //     //         return translation.languages_code === fallbackLocale.value;
  //     //       });
  //     //     }
  //     //     l_member.pronouns = trans?.pronouns ?? "";
  //     //     (l_team.members as ILocalizedTeamMember[]).push(l_member);
  //     //   }
  //     // });

  //     list.push(l_team);
  //   });

  //   return list;
  // });

  const localizedTeams = computed((): ILocalizedTeam[] => {
    if (!teams.value) return [];

    return teams.value.map((team) => {
      const localizedMembers = team.members?.map(localizeMember) ?? [];

      const charterMembers = team.charter ?? [];

      return {
        id: team.id,
        slug: slugify(team.name),
        name: team.name,
        logo: team.logo,
        instagram: team.Instagram,
        facebook: team.Facebook,
        website: team.Website,
        crowdfunding: team.Crowdfunding,
        countriesRepresented: team.countries_represented,
        history: team.team_history,
        anecdotes: team.team_anecdotes,
        nameLetters: team.name_letters,
        previousParticipations: team.previous_participations,
        members: localizedMembers,
        charter: charterMembers.map(localizeMember),
      };
    });
  });

  function getTeamBySlug(slug: string) {
    return localizedTeams.value.find((t) => t.slug === slug);
  }

  /**
   * Expose the required properties, getters and actions
   */
  return { fetch, isReady, teams, localizedTeams, getTeamBySlug };
});
