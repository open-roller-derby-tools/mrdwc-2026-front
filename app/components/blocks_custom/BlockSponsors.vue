<template>
  <div>
    <ul class="flex gap-6 justify-center bg-red-text p-6">
      <li
        v-for="sponsor, i in sponsorsStore.localizedSponsors"
        :key="`sponsor_${i}`"
      >
        <p v-if="!sponsor.logo">{{ sponsor.name }}</p>
        <NuxtImg
          v-else
          :src="`${config.public.apiBase}/assets/${sponsor.logo}`"
          :alt="sponsor.name"
          :title="sponsor.name"
          class="h-24"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
const sponsorsStore = useSponsorsStore();
const config = useRuntimeConfig();
</script>

<style></style>