<template>
	<div>
		<div class="maxed padded mt-8">
			<NuxtLinkLocale to="/announcers/teams" class="flex items-center gap-2 text-yellow">
				<UIcon name="i-lucide-arrow-left" class="size-6" />
				<span class="underline underline-offset-2 text-lg">Back to teams</span>
			</NuxtLinkLocale>
		</div>
		<div v-if="team">
			<div v-if="team" class="maxed padded pt-6 sm:pt-16">
				<div class="sm:py-16 sm:pt-0">
					<div class="flex flex-col gap-10 sm:flex-row mb-6 sm:mb-0 items-start">
						<div class="flex flex-1 w-full items-center justify-center">
							<!-- Logo -->
							<NuxtImg
								:src="`${config.public.apiBase}/assets/${team.logo}?width=300&format=webp&quality=70`"
								:alt="team.name"
								class="w-1/2 sm:w-full rounded-lg bg-white"
							/>
						</div>
						<div class="flex-2">
							<TeamLettersBadge :team="team" class="px-2.5! py-1! text-base! sm:text-lg! mb-2" />
							<h1 v-if="team.name" class="flex gap-2 items-center mb-2">
								{{ team.name }}
							</h1>
							<p v-if="team.countriesRepresented" class="mt-2 italic">
								{{ team.countriesRepresented }}
							</p>
							<!--
                          <p v-if="team.history" class="mt-6 text-left sm:text-justify">
                          {{ team.history }}
                        </p>
                        -->
							<!-- PREMIÈRE PARTICIPATION -->
							<div v-if="isFirstParticipation" class="mt-8">
								<div class="flex items-center gap-2">
									<UIcon
										name="i-lucide-arrow-down-right"
										class="text-yellow size-6 sm:size-8 -rotate-45"
									/>
									<span class="italic text-xl text-yellow">{{ t("first_participation") }}</span>
								</div>
							</div>

							<!-- LISTE DES PARTICIPATIONS -->
							<div v-else-if="team.previousParticipations?.length" class="mt-8">
								<p class="font-semibold mb-2">
									{{ t("previous_participations") }}
								</p>

								<div class="flex gap-2 flex-wrap">
									<span
										v-for="year in sortedParticipations"
										:key="year"
										class="px-3 py-1 bg-blue-text rounded-full text-sm"
									>
										{{ year }}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="flex flex-col sm:flex-row">
					<div
						v-if="team.facebook || team.instagram || team.website || team.crowdfunding"
						class="flex flex-col-reverse gap-6 sm:gap-10 sm:flex-row mb-6 sm:mb-0 w-full items-center place-content-between bg-blue-text border-1 border-white/50 shadow-xl rounded-2xl sm:rounded-full py-7 px-5 sm:py-3 sm:pl-5 sm:pr-3"
					>
						<div
							v-if="team.facebook || team.instagram || team.website"
							class="flex flex-row gap-3 sm:gap-4 items-center"
						>
							<a
								v-if="team.facebook"
								:href="team.facebook"
								target="_blank"
								class="group hover:text-yellow duration-200 transition-all"
							>
								<IconFacebook class="w-10 h-10 transition-all duration-200 group-hover:scale-125" />
							</a>

							<a
								v-if="team.instagram"
								:href="team.instagram"
								target="_blank"
								class="group hover:text-yellow duration-200 transition-all"
							>
								<IconInstagram
									class="w-10 h-10 transition-all duration-200 group-hover:scale-125"
								/>
							</a>

							<a
								v-if="team.website"
								:href="team.website"
								target="_blank"
								class="group hover:text-yellow duration-200 transition-all flex items-center justify-center"
							>
								<UIcon
									name="i-lucide-globe"
									class="w-11 h-11 transition-all duration-200 group-hover:scale-125"
								/>
							</a>
						</div>
						<div v-if="team.crowdfunding" class="flex flex-row gap-2 sm:gap-4">
							<a
								v-if="team.crowdfunding"
								:href="team.crowdfunding"
								target="_blank"
								class="group inline-flex items-center text-lg gap-2 border-1 border-yellow bg-yellow text-blue-text px-5 py-3 rounded-full font-semibold hover:bg-red-200 hover:text-red-light hover:border-red-light transition-all duration-200 cursor-pointer"
							>
								<UIcon
									name="i-lucide-heart-handshake"
									class="size-7 transition-all duration-200 group-hover:scale-125"
								/>
								{{ t("support") }}
							</a>
						</div>
					</div>
				</div>
			</div>

			<!-- ANNOUNCERS INFORMATION -->
			<div v-if="hasAnnouncerInfo" class="maxed padded pt-10">
				<h2 class="text-2xl sm:text-3xl font-bold mb-8 flex items-center gap-3">
					<UIcon name="i-lucide-megaphone" class="size-8 text-yellow" />
					{{ t("announcers_info") }}
				</h2>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Countries Represented -->
					<div
						v-if="team.countriesRepresented"
						class="bg-blue-text border border-white/20 rounded-xl p-6"
					>
						<h3 class="text-lg font-semibold text-yellow mb-3 flex items-center gap-2">
							<UIcon name="i-lucide-globe-2" class="size-5" />
							{{ t("countries_represented") }}
						</h3>
						<p class="whitespace-pre-line">{{ team.countriesRepresented }}</p>
					</div>

					<!-- Preparation Games -->
					<div
						v-if="team.preparationGames"
						class="bg-blue-text border border-white/20 rounded-xl p-6"
					>
						<h3 class="text-lg font-semibold text-yellow mb-3 flex items-center gap-2">
							<UIcon name="i-lucide-swords" class="size-5" />
							{{ t("preparation_games") }}
						</h3>
						<p class="whitespace-pre-line">{{ team.preparationGames }}</p>
					</div>

					<!-- National Anthem -->
					<div
						v-if="team.nationalAnthem"
						class="bg-blue-text border border-white/20 rounded-xl p-6"
					>
						<h3 class="text-lg font-semibold text-yellow mb-3 flex items-center gap-2">
							<UIcon name="i-lucide-music" class="size-5" />
							{{ t("national_anthem") }}
						</h3>
						<p class="whitespace-pre-line">{{ team.nationalAnthem }}</p>
					</div>

					<!-- Anthem Audio -->
					<div v-if="team.anthemAudio" class="bg-blue-text border border-white/20 rounded-xl p-6">
						<h3 class="text-lg font-semibold text-yellow mb-3 flex items-center gap-2">
							<UIcon name="i-lucide-volume-2" class="size-5" />
							{{ t("anthem_audio") }}
						</h3>
						<audio controls class="w-full mt-2">
							<source
								:src="`${config.public.apiBase}/assets/${team.anthemAudio}`"
								type="audio/mpeg"
							/>
							{{ t("play_audio") }}
						</audio>
					</div>

					<!-- Parade Audio -->
					<div v-if="team.paradeAudio" class="bg-blue-text border border-white/20 rounded-xl p-6">
						<h3 class="text-lg font-semibold text-yellow mb-3 flex items-center gap-2">
							<UIcon name="i-lucide-music-2" class="size-5" />
							{{ t("parade_audio") }}
						</h3>
						<audio controls class="w-full mt-2">
							<source
								:src="`${config.public.apiBase}/assets/${team.paradeAudio}`"
								type="audio/mpeg"
							/>
							{{ t("play_audio") }}
						</audio>
					</div>
				</div>

				<!-- Team History (full width) -->
				<div v-if="team.history" class="bg-blue-text border border-white/20 rounded-xl p-6 mt-6">
					<h3 class="text-lg font-semibold text-yellow mb-3 flex items-center gap-2">
						<UIcon name="i-lucide-book-open" class="size-5" />
						{{ t("team_history") }}
					</h3>
					<p class="whitespace-pre-line">{{ team.history }}</p>
				</div>

				<!-- Team Anecdotes (full width) -->
				<div v-if="team.anecdotes" class="bg-blue-text border border-white/20 rounded-xl p-6 mt-6">
					<h3 class="text-lg font-semibold text-yellow mb-3 flex items-center gap-2">
						<UIcon name="i-lucide-lightbulb" class="size-5" />
						{{ t("team_anecdotes") }}
					</h3>
					<p class="whitespace-pre-line">{{ team.anecdotes }}</p>
				</div>
			</div>

			<div v-if="team">
				<div class="relative pb-16 sm:py-0">
					<!-- 🆕 TABS SLOT -->
					<BlockTabsSlot v-if="team" :data="tabsConfig" class="mt-10">
						<!-- TAB 1 : MEMBERS -->
						<template #charter>
							<!-- MOBILE SWIPER -->
							<div class="sm:hidden bg-blue-text py-10">
								<Swiper
									:slides-per-view="1.2"
									:space-between="16"
									:grab-cursor="true"
									:centered-slides="true"
									class="!items-stretch"
									@slide-change="onSlideChangeCharter"
								>
									<SwiperSlide v-for="m in charterSorted" :key="m.id" class="flex h-auto">
										<div class="px-6">
											<TeamMemberCard
												:member="m"
												:team-logo="team.logo"
												:is-announcer="true"
												class="flex-1"
											/>
										</div>
									</SwiperSlide>
								</Swiper>

								<!-- PAGINATION -->
								<div class="text-center text-sm text-white/60 mt-4">
									{{ charterIndex + 1 }} / {{ charterSorted.length }}
								</div>
							</div>
							<!-- DESKTOP GRID -->
							<div
								class="hidden sm:grid padded pt-10 pb-30 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 bg-blue-text gap-10"
							>
								<TeamMemberCard
									v-for="m in charterSorted"
									:key="m.id"
									:member="m"
									:team-logo="team.logo"
									:is-announcer="true"
								/>
							</div>
						</template>

						<!-- TAB 2 : CHARTER -->
						<template #staffMembers>
							<!-- MOBILE -->
							<div class="sm:hidden bg-blue-text py-10">
								<Swiper
									:slides-per-view="1.2"
									:space-between="16"
									:grab-cursor="true"
									:centered-slides="true"
									class="!items-stretch min-h-[320px]"
									@slide-change="onSlideChangeStaff"
								>
									<SwiperSlide v-for="m in staffMembers" :key="m.id" class="flex h-auto">
										<div class="px-6 h-full flex">
											<TeamMemberCard
												:member="m"
												:team-logo="team.logo"
												:is-announcer="true"
												class="flex-1"
											/>
										</div>
									</SwiperSlide>
								</Swiper>

								<div class="text-center text-sm text-white/60 mt-4">
									{{ staffIndex + 1 }} / {{ staffMembers.length }}
								</div>
							</div>
							<div
								class="hidden sm:grid padded pt-10 pb-30 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 bg-blue-text gap-10"
							>
								<TeamMemberCard
									v-for="m in staffMembers"
									:key="m.id"
									:member="m"
									:team-logo="team.logo"
									:is-announcer="true"
								/>
							</div>
						</template>
					</BlockTabsSlot>
				</div>
			</div>
		</div>
		<div v-else>
			<p>Team not found</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { ILocalizedTeamMember } from "~~/types/teams";

import { computed, ref } from "vue";
import { useRoute } from "vue-router";

import { Swiper, SwiperSlide } from "swiper/vue";
import IconFacebook from "~/components/icons/IconFacebook.vue";
import IconInstagram from "~/components/icons/IconInstagram.vue";
import BlockTabsSlot from "~/components/blocks/BlockTabsSlot.vue";
import TeamMemberCard from "~/components/TeamMemberCard.vue";
import TeamLettersBadge from "~/components/partials/TeamLettersBadge.vue";

const { t } = useI18n();
const route = useRoute();
const teamsStore = useTeamsStore();
const config = useRuntimeConfig();

definePageMeta({
	layout: "announcers",
});

const team = computed(() => teamsStore.getTeamBySlug(String(route.params.slug)) ?? null);

const sortedParticipations = computed(() => {
	if (!team.value?.previousParticipations) return [];

	return [...team.value.previousParticipations].map(Number).sort((a, b) => b - a);
});

const isFirstParticipation = computed(() => team.value?.previousParticipations?.includes("2026"));

const hasAnnouncerInfo = computed(() => {
	if (!team.value) return false;
	return !!(
		team.value.countriesRepresented ||
		team.value.preparationGames ||
		team.value.nationalAnthem ||
		team.value.anthemAudio ||
		team.value.paradeAudio ||
		team.value.history ||
		team.value.anecdotes
	);
});

const tabsConfig = computed(() => ({
	anchor_id: "team-tabs",
	classes: "",
	tabs: [
		{ label: "Charter", slotKey: "charter" },
		{ label: "Staff", slotKey: "staffMembers" },
	],
}));

const staffMembers = computed(() => {
	const members = team.value?.members ?? [];

	const isBench = (m: ILocalizedTeamMember) =>
		m.roles?.some((r: string) => r.toLowerCase().includes("bench"));

	const isStaff = (m: ILocalizedTeamMember) =>
		m.roles?.some((r: string) => r.toLowerCase().includes("staff"));

	return [...members]
		.filter((m) => isBench(m) || isStaff(m))
		.sort((a, b) => {
			const aBench = isBench(a) ? 0 : 1;
			const bBench = isBench(b) ? 0 : 1;

			// bench staff en premier
			if (aBench !== bBench) return aBench - bBench;

			// sinon stabilité
			return (a.derbyname ?? "").localeCompare(b.derbyname ?? "");
		});
});

const charterSorted = computed(() => {
	const members = team.value?.charter ?? [];

	return [...members].sort((a, b) => {
		const aKey = (a.number ?? "").charAt(0) || "9";
		const bKey = (b.number ?? "").charAt(0) || "9";

		if (aKey !== bKey) {
			return aKey.localeCompare(bKey);
		}

		// fallback : ordre stable dans le groupe
		return (a.number ?? "").localeCompare(b.number ?? "");
	});
});

const charterIndex = ref(0);
const staffIndex = ref(0);

const onSlideChangeCharter = (swiper: { activeIndex: number }) => {
	charterIndex.value = swiper.activeIndex;
};

const onSlideChangeStaff = (swiper: { activeIndex: number }) => {
	staffIndex.value = swiper.activeIndex;
};
</script>
