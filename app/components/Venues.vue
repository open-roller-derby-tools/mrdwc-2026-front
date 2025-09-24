<template>
  <div class="">
    <NuxtImg
      :src="currentVenueImage"
      :alt="t(currentVenueImageAlt)"
      class="rounded-t-2xl w-full aspect-video object-cover"
    ></NuxtImg>
    <div class="bg-white text-blue-text rounded-b-2xl p-6">
      <p class="font-shoulders font-medium text-4xl">{{ t("venues") }}</p>
      <Venue
        v-for="(venue, index) in venues"
        :key="index"
        :venue="venue"
        @mouseover="selectVenue(index)"
        @touchstart="selectVenue(index)"
      ></Venue>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IVenue } from "~~/types/custom";

const { t } = useI18n();

const venues: IVenue[] = [
  {
    name: "Palais des Sports",
    address: "14 rue Eugène Vignat 45000 Orléans",
    image: "primary_venue.jpg",
    image_alt: "image_alts.primary_venue",
    map_link: "https://maps.app.goo.gl/RRA4T2b2NgB9PDc37",
  },
  {
    name: "L'Argonaute",
    address: "73 Bd Marie Stuart 45000 Orléans",
    image: "secondary_venue.jpg",
    image_alt: "image_alts.secondary_venue",
    map_link: "https://maps.app.goo.gl/ijyzUYUaNzQmz65B7",
  },
];

const currentVenueIndex = ref<number>(0);

const currentVenueImage = computed(() => {
  return venues[currentVenueIndex.value]?.image || "";
});
const currentVenueImageAlt = computed(() => {
  return venues[currentVenueIndex.value]?.image_alt || "";
});

const selectVenue = (index: number) => {
  currentVenueIndex.value = index;
};
</script>
