<template>
	<div class="flex gap-4 sm:gap-6 bg-white rounded-xl shadow-lg overflow-hidden">
		<!-- LEFT: Photo + Name/Number as legend -->
		<div class="flex-shrink-0 flex flex-col items-center w-32 sm:w-40 p-3 sm:p-4">
			<!-- Photo -->
			<div
				class="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-blue-inactive"
			>
				<NuxtImg
					v-if="teamLogo"
					:src="`${config.public.apiBase}/assets/${teamLogo}?width=200&quality=70`"
					:alt="displayName"
					class="absolute inset-0 w-full h-full object-contain opacity-70 mix-blend-multiply grayscale transition-opacity duration-300"
					:class="isLoaded ? 'opacity-0' : 'opacity-70'"
				/>
				<NuxtImg
					v-if="member.rosterPhoto"
					:src="`${config.public.apiBase}/assets/${member.rosterPhoto}?width=200&quality=70`"
					:alt="displayName"
					loading="lazy"
					class="absolute inset-0 w-full h-full object-cover object-top transition-all duration-500"
					:class="isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'"
					@load="isLoaded = true"
				/>
			</div>
			<!-- Name & Number -->
			<div class="flex flex-col items-center mt-2 text-center">
				<div v-if="member.number && !isStaffLike" class="text-red-light font-bold text-base">
					#{{ member.number }}
				</div>
				<div class="text-blue-text uppercase font-semibold text-xs sm:text-sm leading-tight">
					{{ displayName }}
				</div>
				<div v-if="member.derbynamePronunciation" class="text-xs text-black italic">
					<span class="font-medium">[{{ member.derbynamePronunciation }}]</span>
				</div>
				<div
					v-if="isBenchStaff"
					class="text-xs text-red-light font-semibold uppercase tracking-wide"
				>
					Bench Staff
				</div>
			</div>
		</div>

		<!-- RIGHT: Extra info -->
		<div class="flex-1 flex flex-col py-3 sm:py-4 pr-3 sm:pr-4 min-w-0">
			<div
				v-if="member.leaguesRepresented"
				class="text-sm sm:text-base text-gray-600 italic whitespace-pre-line"
			>
				{{ member.leaguesRepresented }}
			</div>
			<div
				v-if="member.memberInformation"
				class="mt-1 text-sm sm:text-base text-gray-700 whitespace-pre-line"
			>
				{{ member.memberInformation }}
			</div>
			<div v-if="member.announcerNotes" class="mt-1 text-sm sm:text-base text-gray-700">
				<span class="font-semibold text-gray-500 text-xs uppercase tracking-wide">{{
					t("announcer_notes")
				}}</span>
				<p class="whitespace-pre-line">
					{{ member.announcerNotes }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { ILocalizedTeamMember } from "~~/types/teams";

const props = defineProps<{
	member: ILocalizedTeamMember;
	teamLogo?: string | null;
}>();

const config = useRuntimeConfig();
const { t } = useI18n();

const isLoaded = ref(false);

const displayName = computed(() => {
	return props.member.derbyname?.trim() || "Unknown";
});

const isBenchStaff = computed(() => {
	return props.member.roles?.some((role) => role.toLowerCase().includes("bench"));
});

const isStaffLike = computed(() => {
	return props.member.roles?.some((role) => {
		const r = role.toLowerCase();
		return r.includes("staff") || r.includes("bench");
	});
});
</script>
