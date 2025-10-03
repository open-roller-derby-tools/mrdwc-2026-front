<template>
  <div class="my-4 text-balance">
    <p class="font-semibold text-xl leading-snug">{{ venue.name }}</p>
    <address class="font-medium text-lg leading-snug -mt-[0.2em]">
      {{ venue.address }}
    </address>
    <NuxtLink
      :to="venue.map_url"
      target="_blank"
      class="flex gap-2 items-center mt-1"
    >
      <div class="w-fit">
        <IconArrow class="text-blue-light w-6 rotate-45"></IconArrow>
      </div>
      <span class="font-shoulders font-medium text-2xl uppercase">{{
        t("see_map")
      }}</span>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedVenue } from "~~/types/custom";
import IconArrow from "./icons/IconArrow.vue";

const { t } = useI18n();

const props = defineProps<{
  venue: ILocalizedVenue;
}>();
</script>
