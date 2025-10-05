<template>
  <div class="">
    <!-- <NuxtImg class="rounded-t-2xl w-full aspect-video object-cover"></NuxtImg> -->
    <div class="bg-white text-blue-text rounded-b-2xl p-6">
      <p class="font-shoulders font-medium text-4xl">{{ t("venues") }}</p>
      <Venue
        v-for="venue, i in venuesStore.localizedVenues"
        :key="`venue_${i}`"
        :venue="venue"
      ></Venue>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useVenuesStore } from "~/stores/venues";
import Venue from "../partials/Venue.vue";

const { t } = useI18n();
const venuesStore = useVenuesStore();
// const config = useRuntimeConfig();

// TODO Get the image hover working again
</script>
