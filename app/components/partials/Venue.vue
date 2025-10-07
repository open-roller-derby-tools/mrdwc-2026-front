<template>
  <div class="my-4 text-balance">
    <p class="font-bold text-2xl mb-2 leading-snug">
      {{ venue.name }}
      <span class="uppercase mx-2 text-xs border-1 border-red-light text-red-light block-inline px-2 py-0.5 rounded-full bg-red-light/20">{{
        venue.type === "main" ? t("venue_primary") : t("venue_secondary")
      }}</span>
    </p>
    <address class="font-medium text-lg leading-snug -mt-[0.2em]">
      {{ venue.address }}
    </address>

    <UButton
      icon="i-lucide-arrow-down-right"
      size="xl"
      class="font-shoulders uppercase text-2xl text-secondary px-0 group gap-1"
      :ui="{
        leadingIcon:
          'text-blue-light size-[32px] transition-transform duration-200 group-hover:-rotate-90',
      }"
      :to="venue.map_url"
      target="_blank"
      rel="noopener noreferrer"
    >{{ t("see_map") }}</UButton>
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedVenue } from "~~/types/custom"
import IconArrow from "../icons/IconArrow.vue"

const { t } = useI18n()

const props = defineProps<{
  venue: ILocalizedVenue
}>()
</script>
