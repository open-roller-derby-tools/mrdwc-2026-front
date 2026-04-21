<template>
	<div class="w-full bg-blue-text py-6">
		<div v-if="isDev" class="maxed padded mb-8">
			<SimulateGamesToggle />
		</div>
		<div class="w-full maxed padded">
			<div class="w-full grid grid-cols-1 gap-4">
				<div
					v-for="group in groups"
					:key="group.id"
					class="bg-white text-black rounded-2xl overflow-hidden"
				>
					<div class="px-4">
						<h3 class="my-4 font-bold text-2xl text-red-text">
							{{ t("group", { number: group.number }) }}
						</h3>
					</div>
					<table class="w-full text-sm table-fixed">
						<thead>
							<tr class="border-b border-blue/20 bg-blue text-white">
								<th class="w-8"></th>
								<th class="!text-left !pl-2">{{ t("teams") }}</th>
								<th class="w-10 md:w-14 lg:w-20">
									<span class="hidden md:inline">{{ t("rankings.played") }}</span
									><span class="md:hidden">{{ t("rankings.played_short") }}</span>
								</th>
								<th class="w-10 md:w-14 lg:w-20">
									<span class="hidden md:inline">{{ t("rankings.won") }}</span
									><span class="md:hidden">{{ t("rankings.won_short") }}</span>
								</th>
								<th class="w-10 md:w-14 lg:w-20">
									<span class="hidden md:inline">{{ t("rankings.lost") }}</span
									><span class="md:hidden">{{ t("rankings.lost_short") }}</span>
								</th>
								<th class="w-10 md:w-16 lg:w-20 hidden sm:table-cell">
									<span class="hidden md:inline">{{ t("rankings.for") }}</span
									><span class="md:hidden">{{ t("rankings.for_short") }}</span>
								</th>
								<th class="w-10 md:w-16 lg:w-20 hidden sm:table-cell">
									<span class="hidden md:inline">{{ t("rankings.against") }}</span
									><span class="md:hidden">{{ t("rankings.against_short") }}</span>
								</th>
								<th
									class="w-10 md:w-16 lg:w-20 hidden sm:table-cell"
									:title="t('rankings.diff_full')"
								>
									<span class="hidden md:inline">{{ t("rankings.diff") }}</span
									><span class="md:hidden">{{ t("rankings.diff_short") }}</span>
								</th>
								<th class="w-12 md:w-16 lg:w-20" :title="t('rankings.adj_full')">
									<span class="hidden md:inline">{{ t("rankings.adj") }}</span
									><span class="md:hidden">{{ t("rankings.adj_short") }}</span>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="(standing, index) in getGroupStandings(group)"
								:key="standing.teamId"
								class="border-b border-blue-text/10 last:border-b-0"
							>
								<td
									class="font-bold"
									:class="{
										'bg-green-50 text-green-700': getOverallRank(standing.teamId) < 8,
										'bg-blue-100 text-blue-700':
											getOverallRank(standing.teamId) >= 8 && getOverallRank(standing.teamId) < 20,
										'bg-red-50 text-red-700': getOverallRank(standing.teamId) >= 20,
										'text-red-text': getOverallRank(standing.teamId) < 0,
									}"
								>
									{{ index + 1 }}
								</td>
								<td class="!pl-2">
									<div class="flex flex-col items-start sm:flex-row sm:items-center gap-1 sm:gap-3">
										<TeamLettersBadge
											:team="getTeamById(standing.teamId)"
											:fallback="null"
											class=""
										/>
										<NuxtLinkLocale
											:to="`/teams/${getTeamById(standing.teamId)?.slug}`"
											class="hover:underline text-left"
										>
											<span class="font-bold leading-none text-balance text-base">
												{{
													getTeamById(standing.teamId)?.country ??
													getTeamById(standing.teamId)?.name
												}}
											</span>
										</NuxtLinkLocale>
									</div>
								</td>
								<td class="">{{ standing.played }}</td>
								<td class="">{{ standing.wins }}</td>
								<td class="">{{ standing.losses }}</td>
								<td class="hidden sm:table-cell">
									{{ standing.pointsFor }}
								</td>
								<td class="hidden sm:table-cell">
									{{ standing.pointsAgainst }}
								</td>
								<td
									class="font-bold hidden sm:table-cell"
									:class="{
										'text-green-600': standing.differential > 0,
										'text-red-text': standing.differential < 0,
									}"
								>
									{{ standing.differential > 0 ? "+" : "" }}{{ standing.differential }}
								</td>
								<td
									class="font-bold"
									:class="{
										'text-green-600': standing.adjustedDifferential > 0,
										'text-red-text': standing.adjustedDifferential < 0,
									}"
								>
									{{ standing.adjustedDifferential > 0 ? "+" : ""
									}}{{ standing.adjustedDifferential }}
								</td>
							</tr>
						</tbody>
					</table>
					<!-- Toggle group games -->
					<div
						v-if="!isNoSpoilerModeActive"
						class="flex justify-center py-3 border-t border-blue-text/10"
					>
						<button
							class="flex items-center gap-1 text-base font-bold text-red-text hover:text-red-light hover:underline transition-colors cursor-pointer"
							@click="toggleGroupGames(group.id)"
						>
							<UIcon
								:name="
									expandedGroups.has(group.id) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'
								"
								class="size-5"
							/>
							<span v-if="!expandedGroups.has(group.id)">{{
								t("rankings.see_scores_and_games")
							}}</span>
							<span v-else>{{ t("rankings.hide_scores_and_games") }}</span>
						</button>
					</div>
					<!-- Group games & scores -->
					<template v-if="!isNoSpoilerModeActive && expandedGroups.has(group.id)">
						<div
							v-if="getGamesByGroup(group.number).length > 0"
							class="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 pb-4"
						>
							<div
								v-for="game in getGamesByGroup(group.number)"
								:key="game.id"
								class="border border-blue-text/20 rounded-lg overflow-hidden"
							>
								<div
									class="flex items-center justify-between px-3 py-1.5 bg-blue-text text-white border-b border-white/20"
								>
									<div class="flex items-center gap-2">
										<TeamLettersBadge
											:team="getTeamById(game.home_team ?? -1)"
											:fallback="game.home_source"
										/>
										<span class="font-medium text-sm">
											{{
												getTeamById(game.home_team ?? -1)?.country ??
												getTeamById(game.home_team ?? -1)?.name ??
												game.home_source ??
												"---"
											}}
										</span>
									</div>
									<span class="font-bold text-lg">
										{{ game.home_score }}
									</span>
								</div>
								<div class="flex items-center justify-between px-3 py-1.5 bg-blue-text text-white">
									<div class="flex items-center gap-2">
										<TeamLettersBadge
											:team="getTeamById(game.away_team ?? -1)"
											:fallback="game.away_source"
										/>
										<span class="font-medium text-sm">
											{{
												getTeamById(game.away_team ?? -1)?.country ??
												getTeamById(game.away_team ?? -1)?.name ??
												game.away_source ??
												"---"
											}}
										</span>
									</div>
									<span class="font-bold text-lg">
										{{ game.away_score }}
									</span>
								</div>
								<div class="flex items-center justify-between px-3 py-1.5 bg-yellow text-blue-text">
									<GameStateLabel :game="game" :with-background="false" :show-time="true" />
									<NuxtLinkLocale
										:to="`/games/${game.number}`"
										class="flex items-center gap-1 text-black"
									>
										<span class="text-sm">{{ t("game_page") }}</span>
										<UIcon name="lucide:arrow-right" class="size-4" />
									</NuxtLinkLocale>
								</div>
							</div>
						</div>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import TeamLettersBadge from "../partials/TeamLettersBadge.vue";
import GameStateLabel from "../partials/games/GameStateLabel.vue";
import SimulateGamesToggle from "../navigation/SimulateGamesToggle.vue";

const { t } = useI18n();
const groupsStore = useGroupsStore();
const teamsStore = useTeamsStore();
const gamesStore = useGamesStore();

const { getTeamById } = teamsStore;
const { getGamesByGroup } = gamesStore;
const { getGroupStandings, getOverallRankings } = useGroupStandings();
const { isNoSpoilerModeActive } = useNoSpoilerMode();

const isDev = import.meta.dev;

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

onMounted(async () => {
	await groupsStore.fetch();
	await teamsStore.fetch();
	await gamesStore.fetch();
});
</script>

<style scoped>
@reference "~/assets/css/main.css";

table {
	th,
	td {
		@apply py-2 px-1 text-center;
	}
}
</style>
