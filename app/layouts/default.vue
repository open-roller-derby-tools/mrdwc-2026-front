<template>
  <div class="">
    <div v-for="team in teams">
      <span class="font-bold text-xl">{{ team.name }}</span>
      <ul class="ml-4">
        <li v-for="team_member in team.members">{{ team_member.number }} - {{ team_member.name }} ({{ team_member.translations[0]?.pronouns }})</li>
      </ul>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { Query, QueryFields } from "@directus/sdk";
import type { Schema, Team, TeamMember } from "~~/types/custom";

const { $directus, $readItems } = useNuxtApp();
const { locale } = useI18n();

const query_fields_teams: QueryFields<Schema, Team> = [
  "name",
  {
    members: [
      "name",
      "number",
      {
        translations: ["languages_code", "pronouns"]
      }
    ],
  }
]

const { data: teams } = await useAsyncData(
  "teams",
  () => {
    return $directus.request($readItems("teams", {
      limit: 99,
      offset: 0,
      fields: query_fields_teams,
      deep: {
        members: {
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
      }
    }))
  },
  {
    watch: [locale]
  }
)
// console.log(teams.value);


</script>

<style></style>
