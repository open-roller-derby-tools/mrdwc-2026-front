<template>
  <div class="grid grid-cols-6 gap-2 items-center mt-4">
    <NuxtImg
      src="ffrs_logo@2x.png"
      :alt="t('image_alts.ffrs_logo')"
      class="col-span-3"
    ></NuxtImg>
    <NuxtImg
      src="mrda_logo@2x.png"
      :alt="t('image_alts.mrda_logo')"
      class=""
    ></NuxtImg>
    <NuxtImg
      src="orleans_logo@2x.png"
      :alt="t('image_alts.orleans_logo')"
      class="col-span-2"
    ></NuxtImg>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
</script>

<style></style>
