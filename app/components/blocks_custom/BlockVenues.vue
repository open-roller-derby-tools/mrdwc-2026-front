<template>
  <div class="px-6 sm:px-0">
    <!-- Carousel images -->
    <UCarousel
      v-if="venuesWithImages.length"
      :items="venuesWithImages"
      dots
      :ui="{
        item: 'w-full self-stretch p-0 rounded-none',
      }"
      class="w-full border-white border-1 overflow-hidden rounded-t-2xl relative"
    >
      <template #default="{ item }">
        <div class="relative w-full h-50">
          <NuxtImg
            v-if="item.image"
            :src="`${config.public.apiBase}/assets/${item.image}`"
            :alt="item.name"
            class="w-full h-full object-cover"
          />
        </div>
      </template>
    </UCarousel>

    <!-- Bloc texte des venues -->
    <div class="bg-white text-blue-text rounded-b-2xl p-6">
      <p class="font-shoulders font-medium text-4xl mb-6">{{ t("venues") }}</p>
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

const config = useRuntimeConfig();
const venuesStore = useVenuesStore()
const { t } = useI18n()

// Filtrer venues qui ont une image pour le carousel
const venuesWithImages = computed(() =>
  venuesStore.localizedVenues.filter((venue) => venue.image)
)

// UI responsive du carousel
const carouselUI = {
  item: "basis-1/2 sm:basis-1/3 md:basis-1/4 self-stretch p-2",
}
</script>

<style scoped>
.UCarousel .u-carousel-item img {
  transition: transform 0.3s ease;
}

.UCarousel .u-carousel-item img:hover {
  transform: scale(1.05);
}

.UCarousel .u-carousel-dots {
  position: absolute !important;
  bottom: 1rem !important;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}
</style>
