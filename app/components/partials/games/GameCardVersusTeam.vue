<template>
  <div>
    <div>
      <p>{{ teamName }}</p>
      <div class="flex items-center gap-2">
        <TeamLettersBadge
          :team="getTeam(game, team)"
          :fallback="teamLetters"
          :style="getTeamColors(game, team, false)"
        />
        <span>{{ teamScore }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IGame } from "~~/types/games";

import TeamLettersBadge from "../TeamLettersBadge.vue";

const props = defineProps<{
  game: IGame;
  team: "home" | "away";
}>();

const { getTeam, getTeamName, getTeamColors } = useGameFormatting();

const teamName = computed(() =>
  getTeamName(
    props.game,
    props.team,
    false,
    props.game[`${props.team}_source`],
  ),
);
const teamLetters = computed(() =>
  getTeamName(props.game, props.team, true, props.game[`${props.team}_source`]),
);
const teamScore = computed(() => props.game[`${props.team}_score`]);
</script>
