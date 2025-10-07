<template>
  <div
    class="flex flex-col w-full sm:w-sm items-center justify-center p-4 border-2 border-dotted rounded-2xl gap-2"
  >
    <h3 class="text-2xl uppercase font-shoulders font-semibold">
      {{ t("socials") }}
    </h3>
    <div class="flex gap-2">
      <NuxtLink
        to="https://www.facebook.com/profile.php?id=61576540781725"
        target="_blank"
        class="hover:text-yellow duration-200 transition-all"
      >
        <IconFacebook class="w-15 h-15" />
      </NuxtLink>
      <NuxtLink
        to="https://www.instagram.com/mensrollerderbyassociation/"
        target="_blank"
        class="hover:text-yellow duration-200 transition-all"
      >
        <IconInstagram class="w-15 h-15" />
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
