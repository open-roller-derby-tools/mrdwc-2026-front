<template>
  <div>
    <ul>
      <li
        v-for="sponsor, i in sponsorsStore.localizedSponsors"
        :key="`sponsor_${i}`"
      >
        <p v-if="!sponsor.logo">{{ sponsor.name }}</p>
        <img
          v-else
          :src="`${config.public.apiBase}/assets/${sponsor.logo}`"
          :alt="sponsor.name"
          :title="sponsor.name"
        >
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
const sponsorsStore = useSponsorsStore();
const config = useRuntimeConfig();
</script>

<style></style>