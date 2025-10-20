<template>
  <div
    :id="data.anchor_id"
    class="block-two-columns relative scroll-mt-24"
    :class="wrapperClasses"
  >
    <div class="maxed padded">
      <!-- TITRES -->
      <div
        v-if="data.title || data.subtitle"
        class="px-0 w-full text-left mb-6 sm:mb-10"
      >
        <h2
          v-if="data.title"
          v-html="formattedTitle"
          class="flex gap-8 items-center font-bold"
        ></h2>
        <h3 v-if="data.subtitle" class="font-light text-white mt-4">
          {{ data.subtitle }}
        </h3>
      </div>

      <!-- CONTENU DEUX COLONNES -->
      <div
        :class="[
          'flex flex-col md:flex-row gap-6 items-start',
          data.reverse_mobile ? 'flex-col-reverse' : '',
        ]"
      >
        <div class="flex-1 w-full md:w-auto">
          <component
            v-for="(block, i) in data.column_a_blocks"
            :key="`block_a_${i}`"
            :is="getBlockComponent(block.collection)"
            :data="block"
          />
        </div>
        <div class="flex-1 w-full md:w-auto">
          <component
            v-for="(block, i) in data.column_b_blocks"
            :key="`block_b_${i}`"
            :is="getBlockComponent(block.collection)"
            :data="block"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedBlockTwoColumns } from "~~/types/custom"

const props = defineProps<{
  data: ILocalizedBlockTwoColumns
}>()

const wrapperClasses = computed(() => {
  const classes: string[] = [props.data.classes, "py-0 sm:py-10"]
  switch (props.data.background) {
    case "white":
      classes.push("bg-white text-blue-text")
      break
    case "yellow":
      classes.push("bg-yellow text-blue-text")
      break
    case "light_blue":
      classes.push("bg-blue-text")
      break
  }
  return classes.join(" ")
})

const formattedTitle = computed(() => {
  if (!props.data.title) return ""

  const regex = /\[([^\]]+)\]/g
  return props.data.title.replace(regex, '<span class="title-badge">$1</span>')
})
</script>

<style>
@reference "~/assets/css/main.css";

.block-two-columns .block-rich-text {
  @apply pt-0 last:pb-0;

  .maxed.padded {
    @apply p-0;
  }

  .bg-white {
    @apply m-0;
  }
}
</style>
