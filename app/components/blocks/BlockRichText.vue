<template>
  <div
    :id="data.anchor_id"
    class="block-rich-text relative scroll-mt-24"
    :class="wrapperClasses"
  >
    <div class="maxed padded">
      <div :class="elementClasses">
        <h2
          v-if="data.title"
          v-html="formattedTitle"
          class="flex gap-8 items-center"
        ></h2>
        <div
          v-if="data.content"
          v-html="data.content"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedBlockRichText } from "~~/types/custom"

const props = defineProps<{
  data: ILocalizedBlockRichText
}>()

const wrapperClasses = computed(() => {
  const classes: string[] = [props.data.classes]
  // Set color and add vertical padding if background_style is "wide"
  if (props.data.background_style == "wide") {
    classes.push("py-6")
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
  }
  return classes.join(" ")
})

const elementClasses = computed(() => {
  const classes: string[] = []
  // Set color and add padding if background_style is "card"
  if (props.data.background_style == "card") {
    classes.push("my-12 px-6 py-4 rounded-2xl")
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

.title-badge {
  @apply text-blue-text text-base bg-yellow px-3 py-1 rounded-full font-cabin normal-case;
}
</style>
