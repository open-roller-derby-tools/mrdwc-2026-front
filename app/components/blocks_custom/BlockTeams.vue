<template>
  <div class="bg-blue-text py-16">
    <div class="maxed padded">
      <ul
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center list-none"
      >
        <li
          v-for="(team, i) in formattedTeams"
          :key="`team_${i}`"
          class="flex flex-col items-center justify-end gap-1"
        >
          <div
            class="flex leading-none min-h-[2.5lh] items-center justify-center text-center"
          >
            <p
              class="text-xl lg:text-2xl font-shoulders leading-none uppercase"
            >
              {{ team.displayName }}
            </p>
          </div>
          <NuxtImg
            :src="`${config.public.apiBase}/assets/${team.logo}`"
            :alt="team.name"
            :title="team.name"
            class="w-auto object-contain cursor-pointer rounded-lg p-2 bg-white"
            @click="
              overlayLogo = `${config.public.apiBase}/assets/${team.logo}`
            "
          />
        </li>
      </ul>

      <Teleport to="body">
        <Transition
          enter-from-class="opacity-0"
          enter-active-class="transition-opacity duration-200 ease-out"
          enter-to-class="opacity-100"
          leave-from-class="opacity-100"
          leave-active-class="transition-opacity duration-200 ease-in"
          leave-to-class="opacity-0"
        >
          <div
            v-if="overlayLogo"
            class="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center cursor-pointer"
            @click="overlayLogo = null"
          >
            <img
              :src="overlayLogo"
              alt=""
              class="max-w-[75vw] max-h-[80vh] w-auto h-auto object-contain pointer-events-none"
            />
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<script lang="ts" setup>
const teamsStore = useTeamsStore();
const config = useRuntimeConfig();

const overlayLogo = ref<string | null>(null);

const formattedTeams = computed(() =>
  teamsStore.localizedTeams.map((team) => ({
    ...team,
    displayName: team.name.replace(
      /\broller\s+derby\s*$/i,
      "Roller\u00A0Derby",
    ),
  })),
);

watch(overlayLogo, (visible) => {
  if (visible) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>
