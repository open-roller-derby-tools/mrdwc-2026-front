<template>
  <div>
    SLUG: {{ route.params.slug }}
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
</script>

<style></style>