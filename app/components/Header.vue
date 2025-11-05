<template>
  <header class="py-4 flex items-center justify-end">
    <NuxtLink
      to="https://www.instagram.com/mrdwc"
      target="_blank"
      class="mr-1"
    >
      <IconInstagram class="w-8 h-8"></IconInstagram>
    </NuxtLink>
    <NuxtLink
      to="https://www.facebook.com/profile.php?id=61576540781725"
      target="_blank"
      class="mr-6"
    >
      <IconFacebook class="w-8 h-8"></IconFacebook>
    </NuxtLink>
  </header>
</template>

<script lang="ts" setup>
import IconFacebook from "./icons/IconFacebook.vue";
import IconInstagram from "./icons/IconInstagram.vue";
</script>
