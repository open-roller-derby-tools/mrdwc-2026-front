<template>
	<div class="w-full bg-blue-text py-6">
		<div class="w-full maxed padded">
			<table class="w-full text-sm table-fixed rounded-2xl overflow-hidden">
				<thead class="bg-blue text-white">
					<tr class="">
						<th class="w-8 md:w-10 lg:w-12"></th>
						<th class="!text-left !pl-2">{{ t("teams") }}</th>
					</tr>
				</thead>
				<tbody class="bg-white text-black">
					<tr
						v-for="(standing, index) in getOverallRankings(groups)"
						:key="standing.teamId"
						class="border-b border-blue-text/10 last:border-b-0"
					>
						<td class="font-bold">
							{{ index + 1 }}
						</td>
						<td class="!pl-2">
							<div class="flex flex-col items-start sm:flex-row sm:items-center gap-1 sm:gap-3">
								<TeamLettersBadge :team="getTeamById(standing.teamId)" />
								<NuxtLinkLocale
									:to="`/teams/${getTeamById(standing.teamId)?.slug}`"
									class="hover:underline text-left"
								>
									<span class="font-bold leading-none text-balance text-base">
										{{
											getTeamById(standing.teamId)?.country ?? getTeamById(standing.teamId)?.name
										}}
									</span>
								</NuxtLinkLocale>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script lang="ts" setup>
import TeamLettersBadge from "../partials/TeamLettersBadge.vue";

const { t } = useI18n();
const groupsStore = useGroupsStore();
const teamsStore = useTeamsStore();
const { getTeamById } = teamsStore;
const { getOverallRankings } = useGroupStandings(); // TODO @roy: getFinalRankings

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
