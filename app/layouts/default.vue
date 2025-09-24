<template>
  <div class="">
    <h1 v-if="teamsStore.pending">Loading...</h1>
    <div
      v-else
      v-for="team in teamsStore.teams"
    >
      <span class="font-bold text-xl">{{ team.name }}</span>
      <ul class="ml-4">
        <li v-for="team_member in team.members">{{ team_member.number }} - {{ team_member.name }} ({{ team_member.translations[0]?.pronouns }})</li>
      </ul>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { useTeamsStore } from '~/stores/teams';

const teamsStore = useTeamsStore()

await callOnce(teamsStore.fetch)
</script>

<style></style>
