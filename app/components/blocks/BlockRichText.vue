<template>
  <div
    class="relative my-4"
    :class="wrapperClasses"
  >
    <div class="maxed">
      <div :class="elementClasses">
        <h1 v-if="data.title">{{ data.title }}</h1>
        <div
          v-if="data.content"
          v-html="data.content"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedBlockRichText } from '~~/types/custom';

const props = defineProps<{
  data: ILocalizedBlockRichText
}>()

const wrapperClasses = computed(() => {
  const classes: string[] = [props.data.classes];
  // Set color and add vertical padding if background_style is "wide"
  if (props.data.background_style == "wide") {
    classes.push("py-8")
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
  return classes.join(" ");
})

const elementClasses = computed(() => {
  const classes: string[] = [];
  // Set color and add padding if background_style is "card"
  if (props.data.background_style == "card") {
    classes.push("px-6 py-4 rounded-2xl")
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
  return classes.join(" ");
})
</script>

<style></style>