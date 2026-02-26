<template>
  <div
    class="wc-title font-shoulders font-bold w-full max-w-[10em] flex flex-col items-end self-end"
    :class="{ 'fonts-loaded': fontsLoaded }"
  >
    <div
      class="date-box flex rounded-2xl border-2 border-white gap-[0.5em] px-[0.5em] py-[0.25em] -mb-[1em]"
    >
      <DatesDate v-if="fontsLoaded" class="text-[0.666em]" :date="startDate" />
      <IconArrow v-if="fontsLoaded" class="w-[0.85em]" />
      <DatesDate v-if="fontsLoaded" class="text-[0.666em]" :date="endDate" />
    </div>

    <NuxtImg src="/mrdwc_title@2x.png" :alt="t('image_alts.title_logo')" />

    <p v-if="fontsLoaded" class="font-medium text-end text-[2.1em] -mt-[0.7em]">
      2026
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import IconArrow from "./icons/IconArrow.vue"

const { t } = useI18n()

const startDate = new Date(2026, 3, 30)
const endDate = new Date(2026, 4, 3)
const fontsLoaded = ref(false)

onMounted(async () => {
  if (document.fonts) {
    await document.fonts.ready
    fontsLoaded.value = true
  } else {
    // Fallback si le navigateur ne supporte pas document.fonts
    setTimeout(() => (fontsLoaded.value = true), 500)
  }
})
</script>

<style scoped>
.wc-title {
  font-size: min(10dvw, 50px);
  transition: opacity 0.3s ease;
}
.wc-title:not(.fonts-loaded) {
  opacity: 0;
}
.wc-title.fonts-loaded {
  opacity: 1;
}
</style>
