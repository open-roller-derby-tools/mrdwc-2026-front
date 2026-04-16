<template>
    <div class="w-full maxed padded my-32">
        <h1>TOURNAMENT GROUPS</h1>
        <h2>TEAMS</h2>
        <div class="w-full grid grid-cols-3 gap-4">
            <div v-for="group in groups" :key="group.id">
                <p class="font-shoulders text-2xl font-bold">Group {{ group.number }}</p>
                <ul>
                    <li v-for="team in group.teams" :key="team">
                        <p>{{ getTeamById(team)?.name_letters }}</p>
                    </li>
                </ul>
            </div>
        </div>
        <h2 class="mt-16">GAMES</h2>
        <div class="w-full grid grid-cols-3 gap-4">
            <div v-for="group in groups" :key="group.id">
                <p class="font-shoulders text-2xl font-bold">Group {{ group.number }}</p>
                <ul v-if="getGamesByGroup(group.number).length > 0">
                    <li v-for="game in getGamesByGroup(group.number)" :key="game.id">
                        <p>Game {{ game.number }}: {{ getTeamName(game, "home", true, game.home_source) }} - {{
                            getTeamName(game, "away", true, game.away_source) }}</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const groupsStore = useGroupsStore();
const teamsStore = useTeamsStore();
const gamesStore = useGamesStore();
const { getTeamName } = useGameFormatting();
const { getTeamById } = teamsStore;
const { getGamesByGroup } = gamesStore;

onMounted(async () => {
    await groupsStore.fetch();
    await teamsStore.fetch();
    await gamesStore.fetch();
});

const groups = computed(() => groupsStore.groups ?? []);
</script>