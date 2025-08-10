<template>
  <div>
    <NuxtLink v-for="locale in locales" :to="switchLocalePath(locale.code)">{{
      locale.code
    }}</NuxtLink>
  </div>
</template>

<script lang="ts" setup>
const { locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();
</script>

<style></style>
