<template>
  <div :class="page.classes">
    <component
      v-for="block, i in page.blocks"
      :key="`block_${i}`"
      :is="getBlockComponent(block.collection)"
      :data="block"
    ></component>
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedPage } from '~~/types/custom';

const props = defineProps<{
  page: ILocalizedPage
}>()

</script>

<style></style>