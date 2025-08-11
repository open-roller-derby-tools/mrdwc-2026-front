<template>
  <footer class="maxed py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 sm:gap-0">
    <nav class="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center justify-end">
      <FooterLink
        :label="t('contact')"
        to="#"
      ></FooterLink>
      <FooterLink
        :label="t('privacy_policy')"
        to="#"
      ></FooterLink>
      <FooterLink
        :label="t('terms_of_use')"
        to="#"
      ></FooterLink>
    </nav>
    <NuxtImg
      src="/mrdwc_logo@2x.png"
      class="block sm:hidden w-64 self-center -mb-4"
    ></NuxtImg>
    <p class="text-sm sm:order-first">{{ t("copyright") }}</p>
  </footer>
</template>

<script lang="ts" setup>
const { t } = useI18n();
</script>

<style></style>
