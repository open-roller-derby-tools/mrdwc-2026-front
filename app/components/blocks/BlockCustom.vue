<template>
  <component
    :is="getBlockComponent(data.name)"
    :id="data.anchor_id"
    :class="data.classes"
  ></component>
</template>

<script lang="ts" setup>
import type { ILocalizedBlockCustom } from '~~/types/custom';

defineProps<{
  data: ILocalizedBlockCustom
}>()
</script>

<style></style>