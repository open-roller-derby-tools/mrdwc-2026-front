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
    classes.push("py-10")
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
    classes.push(" px-6 py-4 rounded-2xl")
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

.block-rich-text a.rich-arrow--link {
  @apply inline-flex items-center gap-1 font-shoulders p-0 transition-transform duration-200;

  &::before {
    @apply content-[""] inline-block w-8 h-8 bg-blue-light mask-[url(/arrow-down-right.svg)] mask-no-repeat mask-center mask-contain transition-transform duration-200;
  }

  &:hover::before {
    @apply -rotate-90;
  }
}

/* Yellow button */
a.rich-yellow--button {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;

  font-family: var(--font-shoulders);
  text-transform: uppercase;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-secondary);

  background-color: var(--color-info);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

a.rich-yellow--button:hover {
  background-color: var(--color-yellow);
}

a.rich-yellow--button::after {
  content: "";
  display: inline-block;
  width: 32px;
  height: 32px;
  background-color: currentColor;
  -webkit-mask: url("/arrow-down-right.svg") no-repeat center;
  -webkit-mask-size: contain;
  mask: url("/arrow-down-right.svg") no-repeat center;
  mask-size: contain;

  transform: translateX(0) rotate(-45deg);
  transition: transform 0.2s ease;
}

a.rich-yellow--button:hover::after {
  transform: translateX(4px) rotate(-45deg);
}
</style>
