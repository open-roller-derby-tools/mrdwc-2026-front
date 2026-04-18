<template>
  <div class="w-full maxed padded my-8">
    <div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="group in groups"
        :key="group.id"
        class="bg-white text-black rounded-2xl p-4"
      >
        <h3 class="font-bold text-2xl text-red-text">
          {{ t("group", { number: group.number }) }}
        </h3>
        <ul class="list-none text-base">
          <li v-for="team in group.teams" :key="team">
            <NuxtLink :to="`/teams/${getTeamById(team)?.slug}`">
              <span
                class="font-mono font-bold px-1.5 mr-2 bg-yellow text-black rounded-md"
              >
                {{ getTeamById(team)?.name_letters }}</span
              >
              <span class="font-medium">
                {{ getTeamById(team)?.name }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
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
