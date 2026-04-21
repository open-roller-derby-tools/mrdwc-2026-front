<template>
	<div
		class="group flex flex-col h-full border-1 border-white/30 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
	>
		<!-- IMAGE -->
		<div
			class="aspect-square flex-shrink-0 bg-blue-inactive flex justify-center relative overflow-hidden"
		>
			<!-- FALLBACK LOGO TEAM -->
			<NuxtImg
				v-if="teamLogo"
				:src="`${config.public.apiBase}/assets/${teamLogo}?width=300&quality=70`"
				:alt="displayName"
				class="absolute inset-0 w-full h-full object-contain opacity-70 mix-blend-multiply grayscale transition-opacity duration-300"
				:class="isLoaded ? 'opacity-0' : 'opacity-70'"
			/>

			<!-- PHOTO -->
			<NuxtImg
				v-if="member.rosterPhoto"
				:src="`${config.public.apiBase}/assets/${member.rosterPhoto}?width=300&quality=70`"
				:alt="displayName"
				loading="lazy"
				class="absolute inset-0 w-full h-full object-cover object-top transition-all duration-500"
				:class="isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'"
				@load="isLoaded = true"
			/>
		</div>

		<!-- INFOS -->
		<div
			class="p-4 bg-white flex-1 text-center flex flex-col items-center min-h-[90px]"
			:class="isAnnouncer ? 'justify-start' : 'justify-center'"
		>
			<div v-if="member.number && !isStaffLike" class="text-red-light font-bold text-xl">
				#{{ member.number || "—" }}
			</div>

			<div class="text-blue-text uppercase font-semibold text-xl">
				{{ displayName }}
			</div>

			<!-- BENCH STAFF -->
			<div v-if="isBenchStaff" class="text-xl text-red-light font-semibold uppercase tracking-wide">
				Bench Staff
			</div>

			<!-- ANNOUNCER EXTRA INFO -->
			<template v-if="isAnnouncer">
				<div v-if="member.leaguesRepresented" class="mt-3 text-base text-gray-600 italic w-full">
					{{ member.leaguesRepresented }}
				</div>
				<div v-if="member.derbynamePronunciation" class="mt-2 text-base text-gray-500 italic">
					<span class="font-medium text-gray-400">[{{ member.derbynamePronunciation }}]</span>
				</div>
				<div
					v-if="member.memberInformation"
					class="mt-2 text-base text-left text-gray-700 whitespace-pre-line w-full"
				>
					{{ member.memberInformation }}
				</div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { ILocalizedTeamMember } from "~~/types/custom";

const props = defineProps<{
	member: ILocalizedTeamMember;
	teamLogo?: string | null;
	isAnnouncer?: boolean;
}>();

const config = useRuntimeConfig();

const isLoaded = ref(false);

/**
 * Nom affiché :
 * derbyname
 */
const displayName = computed(() => {
	return props.member.derbyname?.trim() || "Unknown";
});

/**
 * Détection bench staff
 */
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
