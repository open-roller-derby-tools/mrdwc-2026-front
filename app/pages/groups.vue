<template>
  <div>
    <div class="bg-blue-text">
      <div class="w-full maxed padded py-8">
        <h2 class="relative sm:-left-2.5 flex items-center mb-2">
          <u-icon name="i-lucide-arrow-down-right" class="text-yellow size-8 sm:size-12" />
          TOURNAMENT GROUPS
        </h2>
        <SimulateGamesToggle />
        <div class="w-full grid grid-cols-1 gap-4">
          <div v-for="group in groups" :key="group.id" class="bg-white text-black rounded-2xl overflow-hidden">
            <div class="px-4 pt-4 pb-2">
              <h3 class="font-bold text-2xl text-red-text">
                Group {{ group.number }}
              </h3>
            </div>
            <table class="w-full text-sm table-fixed">
              <thead>
                <tr class="border-b border-blue/20 text-left bg-blue text-white">
                  <th class="py-3 w-12"></th>
                  <th class="py-3 pr-2">Team</th>
                  <th class="py-3 px-1 lg:px-2 text-center w-14 md:w-16 lg:w-20">
                    <span class="hidden md:inline">Played</span><span class="md:hidden">P</span>
                  </th>
                  <th class="py-3 px-1 lg:px-2 text-center w-10 md:w-14 lg:w-20">
                    <span class="hidden md:inline">Won</span><span class="md:hidden">W</span>
                  </th>
                  <th class="py-3 px-1 lg:px-2 text-center w-10 md:w-14 lg:w-20">
                    <span class="hidden md:inline">Lost</span><span class="md:hidden">L</span>
                  </th>
                  <th class="py-3 px-1 lg:px-2 text-center w-10 md:w-12 lg:w-20">
                    <span class="hidden md:inline">For</span><span class="md:hidden">F</span>
                  </th>
                  <th class="py-3 px-1 lg:px-2 text-center w-10 md:w-16 lg:w-20">
                    <span class="hidden md:inline">Against</span><span class="md:hidden">A</span>
                  </th>
                  <th class="py-3 px-1 lg:px-2 text-center w-10 md:w-14 lg:w-20">
                    <span class="hidden md:inline">Diff</span><span class="md:hidden">D</span>
                  </th>
                  <th class="py-3 px-1 lg:px-2 pr-4 text-center w-10 md:w-14 lg:w-20">
                    <span class="hidden md:inline">Adj</span><span class="md:hidden">Adj</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(standing, index) in getGroupStandings(group)" :key="standing.teamId"
                  class="border-b border-blue-text/10 last:border-b-0">
                  <td class="py-2 px-2 text-center font-bold" :class="{
                    'bg-green-50 text-green-700': getOverallRank(standing.teamId) < 8,
                    'bg-blue-100 text-blue-700': getOverallRank(standing.teamId) >= 8 && getOverallRank(standing.teamId) < 20,
                    'bg-red-50 text-red-700': getOverallRank(standing.teamId) >= 20,
                    'text-red-text': getOverallRank(standing.teamId) < 0,
                  }">
                    {{ index + 1 }}
                  </td>
                  <td class="py-2 pr-2">
                    <div class="flex items-center gap-3">
                      <TeamLettersBadge :team="getTeamById(standing.teamId)" :fallback="null" class="ml-2" />
                      <NuxtLink :to="`/teams/${getTeamById(standing.teamId)?.slug}`" class="hover:underline">
                        <span class="font-bold leading-none text-balance text-base">
                          {{ getTeamById(standing.teamId)?.name }}
                        </span>
                      </NuxtLink>
                    </div>
                  </td>
                  <td class="py-2 px-1 text-center">{{ standing.played }}</td>
                  <td class="py-2 px-1 text-center">{{ standing.wins }}</td>
                  <td class="py-2 px-1 text-center">{{ standing.losses }}</td>
                  <td class="py-2 px-1 text-center">{{ standing.pointsFor }}</td>
                  <td class="py-2 px-1 text-center">{{ standing.pointsAgainst }}</td>
                  <td class="py-2 px-1 text-center font-bold" :class="{
                    'text-green-600': standing.differential > 0,
                    'text-red-text': standing.differential < 0,
                  }">
                    {{ standing.differential > 0 ? '+' : '' }}{{ standing.differential }}
                  </td>
                  <td class="py-2 px-1 pr-4 text-center font-bold" :class="{
                    'text-green-600': standing.adjustedDifferential > 0,
                    'text-red-text': standing.adjustedDifferential < 0,
                  }">
                    {{ standing.adjustedDifferential > 0 ? '+' : '' }}{{ standing.adjustedDifferential }}
                  </td>
                </tr>
              </tbody>
            </table>
            <template v-if="!expandedGroups.has(group.id)">
              <div class="flex justify-center py-3 border-t border-blue-text/10">
                <button @click="toggleGroupGames(group.id)"
                  class="flex items-center gap-1 text-base font-bold text-red-text hover:text-red-light hover:underline transition-colors cursor-pointer">
                  <UIcon name="i-lucide-chevron-down" class="size-5" />
                  See scores & games
                </button>
              </div>
            </template>
            <template v-else>
              <div v-if="getGamesByGroup(group.number).length > 0"
                class="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 pt-3 pb-4">
                <div v-for="game in getGamesByGroup(group.number)" :key="game.id"
                  class="border border-blue-text/20 rounded-lg overflow-hidden">
                  <div
                    class="flex items-center justify-between px-3 py-1.5 bg-blue-text text-white border-b border-white/20">
                    <div class="flex items-center gap-2">
                      <TeamLettersBadge :team="getTeamById(game.home_team ?? -1)" :fallback="game.home_source" />
                      <span class="font-medium text-sm">
                        {{ getTeamById(game.home_team ?? -1)?.name ?? game.home_source ?? '---' }}
                      </span>
                    </div>
                    <span class="font-bold text-lg">
                      {{ game.home_score }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between px-3 py-1.5 bg-blue-text text-white">
                    <div class="flex items-center gap-2">
                      <TeamLettersBadge :team="getTeamById(game.away_team ?? -1)" :fallback="game.away_source" />
                      <span class="font-medium text-sm">
                        {{ getTeamById(game.away_team ?? -1)?.name ?? game.away_source ?? '---' }}
                      </span>
                    </div>
                    <span class="font-bold text-lg">
                      {{ game.away_score }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between px-3 py-1.5 bg-yellow text-blue-text">
                    <GameStateLabel :game="game" :with-background="false" :show-time="true" />
                    <NuxtLink :to="`/games/${game.id}`" class="text-xs font-bold text-blue-600 hover:underline">
                      Game {{ game.number }} →
                    </NuxtLink>
                  </div>
                </div>
              </div>
              <div class="flex justify-center py-3 border-t border-blue-text/10">
                <button @click="toggleGroupGames(group.id)"
                  class="flex items-center gap-1 text-base font-bold text-red-text hover:text-red-light hover:underline transition-colors cursor-pointer">
                  <UIcon name="i-lucide-chevron-up" class="size-5" />
                  Hide scores & games
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-blue-text">
      <div class="w-full maxed padded py-8">
        <h2 class="relative sm:-left-2.5 flex items-center mb-2">
          <u-icon name="i-lucide-arrow-down-right" class="text-yellow size-8 sm:size-12" />
          GROUP STAGE RANKINGS
        </h2>
        <div class="bg-white text-black rounded-2xl overflow-hidden">
          <table class="w-full text-sm table-fixed">
            <thead>
              <tr class="border-b border-blue/20 text-left bg-blue text-white">
                <th class="py-3 w-12"></th>
                <th class="py-3 pr-2">Team</th>
                <th class="py-3 px-1 lg:px-2 text-center w-14 md:w-16 lg:w-20">
                  <span class="hidden md:inline">Played</span><span class="md:hidden">P</span>
                </th>
                <th class="py-3 px-1 lg:px-2 text-center w-10 md:w-14 lg:w-20">
                  <span class="hidden md:inline">Won</span><span class="md:hidden">W</span>
                </th>
                <th class="py-3 px-1 lg:px-2 text-center w-10 md:w-14 lg:w-20">
                  <span class="hidden md:inline">Lost</span><span class="md:hidden">L</span>
                </th>
                <th class="py-3 px-1 lg:px-2 text-center w-10 md:w-12 lg:w-20">
                  <span class="hidden md:inline">For</span><span class="md:hidden">F</span>
                </th>
                <th class="py-3 px-1 lg:px-2 text-center w-10 md:w-16 lg:w-20">
                  <span class="hidden md:inline">Against</span><span class="md:hidden">A</span>
                </th>
                <th class="py-3 px-1 lg:px-2 text-center w-10 md:w-14 lg:w-20">
                  <span class="hidden md:inline">Diff</span><span class="md:hidden">D</span>
                </th>
                <th class="py-3 px-1 lg:px-2 pr-4 text-center w-10 md:w-14 lg:w-20">
                  <span class="hidden md:inline">Adj</span><span class="md:hidden">Adj</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(standing, index) in getOverallRankings(groups)" :key="standing.teamId"
                class="border-b border-blue-text/10 last:border-b-0">
                <td class="py-2 px-2 text-center font-bold" :class="{
                  'bg-green-50 text-green-700': index < 8,
                  'bg-blue-100 text-blue-700': index >= 8 && index < 20,
                  'bg-red-50 text-red-700': index >= 20,
                }">
                  {{ index + 1 }}
                </td>
                <td class="py-2 pr-2">
                  <div class="flex items-center gap-3">
                    <TeamLettersBadge :team="getTeamById(standing.teamId)" :fallback="null" class="ml-2" />
                    <NuxtLink :to="`/teams/${getTeamById(standing.teamId)?.slug}`" class="hover:underline">
                      <span class="font-bold leading-none text-balance text-base">
                        {{ getTeamById(standing.teamId)?.name }}
                      </span>
                    </NuxtLink>
                  </div>
                </td>
                <td class="py-2 px-1 text-center">{{ standing.played }}</td>
                <td class="py-2 px-1 text-center">{{ standing.wins }}</td>
                <td class="py-2 px-1 text-center">{{ standing.losses }}</td>
                <td class="py-2 px-1 text-center">{{ standing.pointsFor }}</td>
                <td class="py-2 px-1 text-center">{{ standing.pointsAgainst }}</td>
                <td class="py-2 px-1 text-center font-bold" :class="{
                  'text-green-600': standing.differential > 0,
                  'text-red-text': standing.differential < 0,
                }">
                  {{ standing.differential > 0 ? '+' : '' }}{{ standing.differential }}
                </td>
                <td class="py-2 px-1 pr-4 text-center font-bold" :class="{
                  'text-green-600': standing.adjustedDifferential > 0,
                  'text-red-text': standing.adjustedDifferential < 0,
                }">
                  {{ standing.adjustedDifferential > 0 ? '+' : '' }}{{ standing.adjustedDifferential }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex items-center gap-6 px-4 pt-3 pb-4 text-xs font-medium text-white/70">
          <span class="flex items-center gap-1.5">
            <span class="inline-block w-3 h-3 rounded-sm bg-green-50 border border-green-200"></span>
            Bracket Play (1–8)
          </span>
          <span class="flex items-center gap-1.5">
            <span class="inline-block w-3 h-3 rounded-sm bg-blue-100 border border-blue-300"></span>
            Rankings Play (9–20)
          </span>
          <span class="flex items-center gap-1.5">
            <span class="inline-block w-3 h-3 rounded-sm bg-red-50 border border-red-200"></span>
            Eliminated (21–24)
          </span>
        </div>
      </div>
    </div>

    <div class="w-full maxed padded my-32">
      <h2>GAMES</h2>
      <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="group in groups" :key="group.id">
          <p class="font-shoulders text-2xl font-bold">
            Group {{ group.number }}
          </p>

          <ul v-if="getGamesByGroup(group.number).length > 0">
            <li v-for="game in getGamesByGroup(group.number)" :key="game.id">
              <p class="flex gap-1">
                <span>Game {{ game.number }}:</span>
                <span>{{
                  getTeamName(game, "home", true, game.home_source)
                  }}</span>
                <span>{{ game.home_score }}</span>
                <span>-</span>
                <span>{{ game.away_score }}</span>
                <span>{{
                  getTeamName(game, "away", true, game.away_source)
                  }}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SimulateGamesToggle from "~/components/navigation/SimulateGamesToggle.vue";
import GameStateLabel from "~/components/partials/games/GameStateLabel.vue";
import TeamLettersBadge from "~/components/partials/TeamLettersBadge.vue";

const groupsStore = useGroupsStore();
const teamsStore = useTeamsStore();
const gamesStore = useGamesStore();
const { getTeamName } = useGameFormatting();
const { getGroupStandings, getOverallRankings } = useGroupStandings();
const { getGamesByGroup } = gamesStore;
const { getTeamById } = teamsStore;

onMounted(async () => {
  await groupsStore.fetch();
  await teamsStore.fetch();
  await gamesStore.fetch();
});

const groups = computed(() => groupsStore.groups ?? []);

const overallRankMap = computed(() => {
  const rankings = getOverallRankings(groups.value);
  const map = new Map<number, number>();
  rankings.forEach((standing, index) => {
    map.set(standing.teamId, index);
  });
  return map;
});

function getOverallRank(teamId: number): number {
  return overallRankMap.value.get(teamId) ?? -1;
}

const expandedGroups = reactive(new Set<number>());

function toggleGroupGames(groupId: number) {
  if (expandedGroups.has(groupId)) {
    expandedGroups.delete(groupId);
  } else {
    expandedGroups.add(groupId);
  }
}
</script>