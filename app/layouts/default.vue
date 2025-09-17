<template>
  <div class="">
    <div v-for="team in teams">{{ team.name }}</div>
    <div v-for="team_member in team_members">{{ team_member.name }} - {{ team_member.team.name }} - {{ team_member.translations[0]?.pronouns }}</div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { Team, TeamMember } from "~~/types/custom";

const { $directus, $readItems } = useNuxtApp();
const { locale } = useI18n();

const { data: teams } = await useAsyncData('teams', () => {
  return $directus.request(
    $readItems('teams', {
      fields: ["*", { members: ["*"] }],
    })
  )
})

const { data: team_members } = await useAsyncData('team_members', () => {
  return $directus.request(
    $readItems('team_members', {
      deep: {
        translations: {
          _filter: {
            _and: [
              {
                languages_code: { _eq: locale.value },
              },
            ],
          },
        },
      },
      fields: ["name", { translations: ["pronouns"], team: ["id", "name"] }],
    })
  )
}, {
  watch: [locale]
})
console.log(teams.value);
console.log(team_members.value);


/* const allTeams: Team[] = await $directus.request($readItems('teams'));
console.log(allTeams);

const allTeamMembers: TeamMember[] = await $directus.request($readItems('team_members', {
  deep: {
    translations: {
      _filter: {
        _and: [
          {
            languages_code: { _eq: "fr-FR" },
          },
        ],
      },
    },
  },
  fields: ["*", { translations: ["*"] }],
}));
console.log(allTeamMembers); */

</script>

<style></style>
