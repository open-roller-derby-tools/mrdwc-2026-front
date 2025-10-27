<template>
  <div>
    <ul class="flex flex-wrap gap-4 sm:gap-6 md:gap-8 lg:gap-10 justify-center bg-red-text p-6">
      <li
        v-for="(sponsor, i) in sponsorsStore.localizedSponsors"
        :key="`sponsor_${i}`"
        class="flex items-center justify-center"
      >
        <a
          :href="sponsor.url ?? '#'"
          target="_blank"
        >
          <p v-if="!sponsor.logo">{{ sponsor.name }}</p>
          <NuxtImg
            v-else
            :src="`${config.public.apiBase}/assets/${sponsor.logo}`"
            :alt="sponsor.name"
            :title="sponsor.name"
            class="h-12 w-auto object-contain sm:h-14 md:h-16 lg:h-20"
          />
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
const sponsorsStore = useSponsorsStore()
const config = useRuntimeConfig()
</script>

<style></style>
