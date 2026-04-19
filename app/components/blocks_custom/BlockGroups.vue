<template>
  <div class="w-full bg-blue-text">
    <div class="w-full maxed padded py-8">
      <h2 class="relative sm:-left-2.5 flex items-center mb-2">
        <u-icon
          name="i-lucide-arrow-down-right"
          class="text-yellow size-8 sm:size-12"
        />{{ t("groups") }}
      </h2>
      <div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="group in groups"
          :key="group.id"
          class="bg-white text-black rounded-2xl p-4"
        >
          <h3 class="font-bold text-2xl text-red-text">
            {{ t("group", { number: group.number }) }}
          </h3>
          <ul class="list-none text-base flex flex-col gap-1">
            <li v-for="team in group.teams" :key="team">
              <NuxtLink
                :to="`/teams/${getTeamById(team)?.slug}`"
                class="flex items-center gap-2"
              >
                <TeamLettersBadge :team="getTeamById(team)" />
                <span class="font-medium leading-none text-balance">
                  {{ getTeamById(team)?.name }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>
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

const groups = computed(() => groupsStore.groups);

onMounted(async () => {
  await groupsStore.fetch();
  await teamsStore.fetch();
});
</script>
