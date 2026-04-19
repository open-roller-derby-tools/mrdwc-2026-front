<template>
  <div>
    <PageHeader :image="null">
      <h1
        class="flex gap-2 items-center mb-2 absolute bottom-2 left-4 sm:left-8 md:left-8 sm:bottom-0"
      >
        <UIcon
          name="i-lucide-arrow-down-right"
          class="text-yellow size-12 sm:size-16"
        />{{ title }}
      </h1>
      <!-- Logo -->
      <NuxtImg
        src="/mrdwc_logo@2x.png"
        :alt="t('image_alts.image_logo')"
        class="absolute -bottom-17 z-10 right-8 md:right-6 lg:right-2 w-52 self-center sm:self-auto hidden md:block"
      />
    </PageHeader>
    <div class="maxed padded" v-if="game">
      <p>Game details will go here</p>
      <div v-if="game.video_url" class="w-full aspect-video">
        <iframe
          :src="game.video_url"
          :title="title"
          frameborder="0"
          allow="
            accelerometer;
            autoplay;
            clipboard-write;
            encrypted-media;
            gyroscope;
            picture-in-picture;
            web-share;
          "
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </div>
    </div>
    <p v-else>Loading game data...</p>
  </div>
</template>

<script lang="ts" setup>
import PageHeader from "~/components/partials/PageHeader.vue";

const route = useRoute();
const { t } = useI18n();
const gamesStore = useGamesStore();
const { getTeamName } = useGameFormatting();

useGamesAutoRefresh({ intervalMs: 30000 });

const game = computed(() =>
  gamesStore.getGameByNumber(Number(route.params.id)),
);

const title = computed(() => {
  if (game.value) {
    const homeTeamName = getTeamName(
      game.value,
      "home",
      true,
      game.value.home_source,
    );
    const awayTeamName = getTeamName(
      game.value,
      "away",
      true,
      game.value.away_source,
    );
    return `${homeTeamName} - ${awayTeamName}`;
  }
  return "Game loading...";
});
</script>
