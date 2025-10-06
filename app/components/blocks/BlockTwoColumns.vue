<template>
  <div
    :id="data.anchor_id"
    class="block-two-columns maxed px-0 py-0 sm:py-12 sm:px-12 grid sm:grid-cols-2 gap-6"
    :classes="data.classes"
  >
    <div>
      <component
        v-for="(block, i) in data.column_a_blocks"
        :key="`block_a_${i}`"
        :is="getBlockComponent(block.collection)"
        :data="block"
      ></component>
    </div>
    <div>
      <component
        v-for="(block, i) in data.column_b_blocks"
        :key="`block_b_${i}`"
        :is="getBlockComponent(block.collection)"
        :data="block"
      ></component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedBlockTwoColumns } from "~~/types/custom"

const props = defineProps<{
  data: ILocalizedBlockTwoColumns
}>()
</script>

<style>
@reference "~/assets/css/main.css";

.block-two-columns .block-rich-text {
  @apply py-0;

  .maxed.padded {
    @apply sm:px-0;
  }
}
</style>
