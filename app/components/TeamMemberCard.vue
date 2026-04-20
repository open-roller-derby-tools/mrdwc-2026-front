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
      class="p-4 bg-white flex-1 text-center flex flex-col items-center justify-center min-h-[90px]"
    >
      <div
        v-if="member.number && !isStaffLike"
        class="text-red-light font-bold text-lg"
      >
        #{{ member.number || "—" }}
      </div>

      <div class="text-blue-text uppercase font-semibold text-lg">
        {{ displayName }}
      </div>

      <!-- BENCH STAFF -->
      <div
        v-if="isBenchStaff"
        class="text-lg text-red-light font-semibold uppercase tracking-wide"
      >
        Bench Staff
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ILocalizedTeamMember } from "~~/types/custom";

const props = defineProps<{
  member: ILocalizedTeamMember;
  teamLogo?: string | null;
}>();

const config = useRuntimeConfig();

const isLoaded = ref(false);

/**
 * Nom affiché :
 * derbyname > firstname
 */
const displayName = computed(() => {
  return props.member.derbyname?.trim() || props.member.firstname || "Unknown";
});

/**
 * Détection bench staff
 */
const isBenchStaff = computed(() => {
  return props.member.roles?.some((role) =>
    role.toLowerCase().includes("bench"),
  );
});

const isStaffLike = computed(() => {
  return props.member.roles?.some((role) => {
    const r = role.toLowerCase();
    return r.includes("staff") || r.includes("bench");
  });
});
</script>
