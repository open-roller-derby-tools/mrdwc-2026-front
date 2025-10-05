<template>
  <section class="relative pt-18">
    <NuxtImg
      src="/background@2x.png"
      :alt="t('image_alts.image_logo')"
      class="object-contain object-left-top absolute top-0 left-0 w-full h-180"
    ></NuxtImg>
    <div class="maxed padded flex flex-col justify-end py-8">
      <WorldCupTitle class="z-10"></WorldCupTitle>
      <div class="w-full flex flex-row items-end justify-end my-8 sm:mt-0 z-10">
        <NuxtImg
          src="/mrdwc_logo@2x.png"
          :alt="t('image_alts.image_logo')"
          class="relative z-10 hidden sm:block sm:w-56 -ml-5 -mr-10 -mb-8"
        ></NuxtImg>
        <Countdown class=""></Countdown>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const { t } = useI18n();
</script>

<style></style>