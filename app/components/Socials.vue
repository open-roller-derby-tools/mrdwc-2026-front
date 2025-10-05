<template>
  <div
    class="flex flex-col items-center justify-center p-4 border-2 border-dotted rounded-2xl gap-4"
  >
    <h3 class="text-xl uppercase font-shoulders font-semibold">
      {{ t("socials") }}
    </h3>
    <div class="flex gap-4">
      <NuxtLink
        to="https://www.facebook.com/profile.php?id=61576540781725"
        target="_blank"
        class="hover:opacity-80 transition-opacity"
      >
        <IconFacebook class="w-10 h-10" />
      </NuxtLink>
      <NuxtLink
        to="https://www.instagram.com/mensrollerderbyassociation/"
        target="_blank"
        class="hover:opacity-80 transition-opacity"
      >
        <IconInstagram class="w-10 h-10" />
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconFacebook from "./icons/IconFacebook.vue"
import IconInstagram from "./icons/IconInstagram.vue"

const { t } = useI18n()
</script>

<style></style>
