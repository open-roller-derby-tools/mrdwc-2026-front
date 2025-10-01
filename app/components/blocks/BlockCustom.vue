<template>
  <div :class="data.classes">
    Custom Block: {{ data?.name }}
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedBlockCustom } from '~~/types/custom';

defineProps<{
  data: ILocalizedBlockCustom
}>()
</script>

<style></style>