<template>
  <div class="">
    <h1 v-if="teamsStore.pending">Loading...</h1>
    <div v-else>
      <div v-for="team in teamsStore.localizedTeams">
        <span class="font-bold text-xl">{{ team.name }}</span>
        <ul class="ml-4">
          <li v-for="team_member in (team.members as ILocalizedTeamMember[])">
            <span>{{ team_member.number }} - {{ team_member.name }}</span>
            (<span>{{ team_member.pronouns }}</span>)
          </li>
        </ul>
      </div>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { useTeamsStore } from '~/stores/teams';
import type { ILocalizedTeamMember } from '~~/types/custom';

const teamsStore = useTeamsStore()
await callOnce(teamsStore.fetch)
</script>

<style></style>
