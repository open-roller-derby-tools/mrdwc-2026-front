<template>
  <div v-if="team">
    <PageHeader :image="null">
      <button
        @click="toggleNotifications"
        class="mb-4 absolute bottom-2 left-0 md:left-8 sm:bottom-0 group inline-flex items-center text-md gap-2 px-3 py-2 rounded-xl font-semibold transition-all duration-300 cursor-pointer border-1"
        :class="
          notificationsEnabled
            ? 'bg-yellow text-blue-text border-blue-text'
            : 'bg-blue-inactive text-blue-text border-blue-inactive hover:bg-red-200 hover:text-red-light hover:border-red-light'
        "
      >
        <UIcon
          :name="notificationsEnabled ? 'i-lucide-bell' : 'i-lucide-bell-off'"
          class="size-7 transition-all duration-300 origin-center"
          :class="[
            notificationsEnabled
              ? 'scale-110 rotate-20'
              : 'animate-bell group-hover:scale-115',
          ]"
        />
        {{
          notificationsEnabled ? t("notifications_on") : t("notifications_off")
        }}
      </button>
      <!-- Logo -->
      <NuxtImg
        src="/mrdwc_logo@2x.png"
        :alt="t('image_alts.image_logo')"
        class="absolute -bottom-17 z-10 right-8 md:right-6 lg:right-2 w-52 self-center sm:self-auto hidden md:block"
      />
    </PageHeader>
    <div v-if="team" class="maxed padded pt-6 sm:pt-16">
      <div class="sm:py-16 sm:pt-0">
        <div class="flex flex-col gap-10 sm:flex-row mb-6 sm:mb-0 items-start">
          <div class="flex flex-1 items-center justify-center">
            <!-- Logo -->
            <NuxtImg
              :src="`${config.public.apiBase}/assets/${team.logo}`"
              :alt="team.name"
              class="w-1/2 sm:w-full rounded-lg bg-white"
            />
          </div>
          <div class="flex-2">
            <h1 v-if="team.name" class="flex gap-2 items-center mb-2">
              {{ team.name }}
            </h1>
            <p v-if="team.countriesRepresented" class="mt-2 italic">
              {{ team.countriesRepresented }}
            </p>
            <p v-if="team.history" class="mt-6 text-left sm:text-justify">
              {{ team.history }}
            </p>
            <!-- PREMIÈRE PARTICIPATION -->
            <div v-if="isFirstParticipation" class="mt-8">
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-arrow-down-right"
                  class="text-yellow size-6 sm:size-8 -rotate-45"
                />
                <span class="italic text-xl text-yellow">{{
                  t("first_participation")
                }}</span>
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
      <div class="flex flex-col sm:flex-row sm:py-16 sm:pt-0">
        <div
          v-if="
            team.facebook || team.instagram || team.website || team.crowdfunding
          "
          class="flex flex-col gap-10 sm:flex-row mb-6 sm:mb-0 w-full items-center place-content-between bg-blue-text border-1 border-white/50 shadow-xl rounded-full py-3 pl-5 pr-3"
        >
          <div
            v-if="team.facebook || team.instagram || team.website"
            class="flex flex-row gap-2 sm:gap-4 items-center"
          >
            <NuxtLink
              v-if="team.facebook"
              :to="team.facebook"
              target="_blank"
              class="group hover:text-yellow duration-200 transition-all"
            >
              <IconFacebook
                class="w-10 h-10 transition-all duration-200 group-hover:scale-125"
              />
            </NuxtLink>

            <NuxtLink
              v-if="team.instagram"
              :to="team.instagram"
              target="_blank"
              class="group hover:text-yellow duration-200 transition-all"
            >
              <IconInstagram
                class="w-10 h-10 transition-all duration-200 group-hover:scale-125"
              />
            </NuxtLink>

            <NuxtLink
              v-if="team.website"
              :to="team.website"
              target="_blank"
              class="group hover:text-yellow duration-200 transition-all flex items-center justify-center"
            >
              <UIcon
                name="i-lucide-globe"
                class="w-11 h-11 transition-all duration-200 group-hover:scale-125"
              />
            </NuxtLink>
          </div>
          <div v-if="team.crowdfunding" class="flex flex-row gap-2 sm:gap-4">
            <NuxtLink
              v-if="team.crowdfunding"
              :to="team.crowdfunding"
              target="_blank"
              class="group inline-flex items-center text-lg gap-2 border-1 border-yellow bg-yellow text-blue-text px-5 py-3 rounded-full font-semibold hover:bg-red-200 hover:text-red-light hover:border-red-light transition-all duration-200 cursor-pointer"
            >
              <UIcon
                name="i-lucide-heart-handshake"
                class="size-7 transition-all duration-200 group-hover:scale-125"
              />
              {{ t("support") }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <div v-if="team" class="sm:pt-16">
      <div class="bg-blue-text py-16 sm:pt-0">
        <div class="maxed padded">
          <div
            class="grid grid-cols-2 sm:flex sm:justify-center gap-2 sm:gap-0.5 mb-6 sm:mb-0 sm:-translate-y-1/2"
          >
            <!--  <button
              v-for="(crew, index) in officialsStore.localizedOfficials"
              :key="`crew_select_${index}`"
              :class="[
                'transition-colors duration-200 font-shoulders font-semibold text-center text-xl px-3 sm:px-6 py-2 rounded-xl sm:rounded-none sm:first:rounded-l-xl sm:last:rounded-r-xl w-full sm:w-auto select-none cursor-pointer',
                selectedCrewIndex === index
                  ? 'bg-yellow text-blue-text'
                  : 'bg-blue-inactive text-blue-text hover:bg-yellow',
              ]"
              @click="selectedCrewIndex = index"
            >
              {{ crew.name }}
            </button> -->
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <p>Équipe introuvable 👻</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const teamsStore = useTeamsStore();
const { t } = useI18n();
const config = useRuntimeConfig();
import { table } from "#build/ui";
import PageHeader from "~/components/partials/PageHeader.vue";
import IconFacebook from "~/components/icons/IconFacebook.vue";
import IconInstagram from "~/components/icons/IconInstagram.vue";

const team = computed(() =>
  teamsStore.localizedTeams.find((t) => t.slug === String(route.params.slug)),
);

const sortedParticipations = computed(() => {
  if (!team.value?.previousParticipations) return [];

  return [...team.value.previousParticipations]
    .map(Number)
    .sort((a, b) => b - a);
});

const isFirstParticipation = computed(() =>
  team.value?.previousParticipations?.includes("2026"),
);

const notificationsEnabled = ref(false);

const toggleNotifications = () => {
  notificationsEnabled.value = !notificationsEnabled.value;
};

console.log("team", team.value);
</script>
