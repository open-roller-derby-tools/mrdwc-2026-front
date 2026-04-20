<template>
	<div class="w-full bg-blue-text py-6">
		<div class="w-full maxed padded">
			<table class="w-full text-sm table-fixed rounded-2xl overflow-hidden">
				<thead class="bg-blue text-white">
					<tr class="">
						<th class="w-8 md:w-10 lg:w-12"></th>
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
						<th class="w-10 md:w-16 lg:w-20 hidden sm:table-cell" :title="t('rankings.diff_full')">
							<span class="hidden md:inline">{{ t("rankings.diff") }}</span
							><span class="md:hidden">{{ t("rankings.diff_short") }}</span>
						</th>
						<th class="w-12 md:w-16 lg:w-20" :title="t('rankings.adj_full')">
							<span class="hidden md:inline">{{ t("rankings.adj") }}</span
							><span class="md:hidden">{{ t("rankings.adj_short") }}</span>
						</th>
					</tr>
				</thead>
				<tbody class="bg-white text-black">
					<tr
						v-for="(standing, index) in getOverallRankings(groups)"
						:key="standing.teamId"
						class="border-b border-blue-text/10 last:border-b-0"
					>
						<td
							class="font-bold"
							:class="{
								'bg-green-50 text-green-700': index < 8,
								'bg-blue-100 text-blue-700': index >= 8 && index < 20,
								'bg-red-50 text-red-700': index >= 20,
							}"
						>
							{{ index + 1 }}
						</td>
						<td class="!pl-2">
							<div class="flex flex-col items-start sm:flex-row sm:items-center gap-1 sm:gap-3">
								<TeamLettersBadge :team="getTeamById(standing.teamId)" :fallback="null" class="" />
								<NuxtLink
									:to="`/teams/${getTeamById(standing.teamId)?.slug}`"
									class="hover:underline text-left"
								>
									<span class="font-bold leading-none text-balance text-base">
										{{ getTeamById(standing.teamId)?.name }}
									</span>
								</NuxtLink>
							</div>
						</td>
						<td class="">{{ standing.played }}</td>
						<td class="">{{ standing.wins }}</td>
						<td class="">{{ standing.losses }}</td>
						<td class="hidden sm:table-cell">{{ standing.pointsFor }}</td>
						<td class="hidden sm:table-cell">{{ standing.pointsAgainst }}</td>
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
							{{ standing.adjustedDifferential > 0 ? "+" : "" }}{{ standing.adjustedDifferential }}
						</td>
					</tr>
				</tbody>
			</table>
			<div
				class="flex flex-col items-start sm:flex-row sm:items-center gap-0 sm:gap-4 py-3 text-sm font-medium text-white/70"
			>
				<span class="flex items-center gap-1.5">
					<span
						class="inline-flex items-center justify-center w-3 h-3 rounded-sm bg-green-50 border border-green-700 text-green-700"
						>×</span
					>
					{{ t("rankings.bracket_play") }}
				</span>
				<span class="flex items-center gap-1.5">
					<span
						class="inline-flex items-center justify-center w-3 h-3 rounded-sm bg-blue-100 border border-blue-700 text-blue-700"
						>×</span
					>
					{{ t("rankings.rankings_play") }}
				</span>
				<span class="flex items-center gap-1.5">
					<span
						class="inline-flex items-center justify-center w-3 h-3 rounded-sm bg-red-50 border border-red-700 text-red-700"
						>×</span
					>
					{{ t("rankings.eliminated") }}
				</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import TeamLettersBadge from "../partials/TeamLettersBadge.vue";

const { t } = useI18n();
const groupsStore = useGroupsStore();
const teamsStore = useTeamsStore();
const { getTeamById } = teamsStore;
const { getOverallRankings } = useGroupStandings();

const groups = computed(() => groupsStore.groups ?? []);

onMounted(async () => {
	await groupsStore.fetch();
	await teamsStore.fetch();
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
