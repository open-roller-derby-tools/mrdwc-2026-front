<template>
  <div
    :id="data.anchor_id"
    :class="[
      'block-two-columns flex flex-col maxed px-0 py-6 sm:pt-12 sm:px-12',
      data.classes,
    ]"
  >
    <!-- TITRES -->
    <div class="px-6 sm:px-0 w-full text-left mb-6">
      <h2 v-if="data.title" class="font-bold mb-2">
        {{ data.title }}
      </h2>
      <h3 v-if="data.subtitle" class="font-light text-gray-600">
        {{ data.subtitle }}
      </h3>
    </div>

    <!-- CONTENU DEUX COLONNES -->
    <div
      :class="[
        'flex flex-col md:flex-row gap-6 items-start',
        data.reverse_mobile ? 'flex-col-reverse md:flex-row-reverse' : '',
      ]"
    >
      <div class="flex-1 w-full sm:w-auto">
        <component
          v-for="(block, i) in data.column_a_blocks"
          :key="`block_a_${i}`"
          :is="getBlockComponent(block.collection)"
          :data="block"
        />
      </div>
      <div class="flex-1 w-full sm:w-auto">
        <component
          v-for="(block, i) in data.column_b_blocks"
          :key="`block_b_${i}`"
          :is="getBlockComponent(block.collection)"
          :data="block"
        />
      </div>
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
