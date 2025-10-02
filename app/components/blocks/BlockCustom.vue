<template>
  <component
    :class="data.classes"
    :is="getBlockComponent(data.name)"
  ></component>
</template>

<script lang="ts" setup>
import type { ILocalizedBlockCustom } from '~~/types/custom';

defineProps<{
  data: ILocalizedBlockCustom
}>()
</script>

<style></style>