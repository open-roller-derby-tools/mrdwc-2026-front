<template>
  <div class="px-6 sm:px-0">
    <!-- Carousel images -->
    <UCarousel
      v-if="venuesWithImages.length"
      v-slot="{ item }"
      loop
      autoplay
      :autoplay-interval="1000"
      :items="venuesWithImages"
      dots
      :ui="{
        item: 'w-full self-stretch p-0 rounded-none',
        dots: 'absolute bottom-2  ',
        dot: 'bg-white/70 border-1 border-white data-[state=active]:bg-red-light',
      }"
      class="w-full border-white border-1 overflow-hidden rounded-t-2xl relative"
    >
      <div class="relative w-full h-50">
        <NuxtImg
          :src="`${config.public.apiBase}/assets/${item.image}`"
          :alt="item.name"
          class="w-full h-full object-cover"
        />
      </div>
    </UCarousel>

    <!-- Bloc texte des venues -->
    <div class="bg-white text-blue-text rounded-b-2xl p-6">
      <p class="font-shoulders font-medium text-4xl md:text-5xl mb-6">
        {{ t("venues") }}
      </p>
      <Venue
        v-for="(venue, i) in venuesStore.localizedVenues"
        :key="`venue_${i}`"
        :venue="venue"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue"
import { useVenuesStore } from "~/stores/venues"
import Venue from "../partials/Venue.vue"

const config = useRuntimeConfig()
const venuesStore = useVenuesStore()
const { t } = useI18n()

// Filtrer venues qui ont une image pour le carousel
const venuesWithImages = computed(() =>
  venuesStore.localizedVenues.filter((venue) => venue.image)
)
</script>

<style scoped></style>
