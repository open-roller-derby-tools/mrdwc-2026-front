<template>
  <div class="maxed grid sm:grid-cols-2 gap-6">
    <div>
      <component
        v-for="block, i in data.column_a_blocks"
        :key="`block_a_${i}`"
        :is="getBlockComponent(block.collection)"
        :data="block"
      ></component>
    </div>
    <div>
      <component
        v-for="block, i in data.column_b_blocks"
        :key="`block_b_${i}`"
        :is="getBlockComponent(block.collection)"
        :data="block"
      ></component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedBlockTwoColumns } from '~~/types/custom';

const props = defineProps<{
  data: ILocalizedBlockTwoColumns
}>()

</script>

<style></style>