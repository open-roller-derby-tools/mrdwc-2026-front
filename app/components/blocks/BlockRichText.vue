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

/* Lien avec flèche */
.block-rich-text {
  a {
    @apply transition-colors duration-200 underline underline-offset-2;

    &:hover {
      @apply text-yellow;
    }
  }

  a.rich-arrow--link {
    @apply inline-flex items-center gap-1 font-shoulders p-0 no-underline;

    &::before {
      @apply content-[""] inline-block w-8 h-8 bg-blue-light mask-[url(/arrow-down-right.svg)] mask-no-repeat mask-center mask-contain transition-transform duration-200;
    }

    &:hover {
      &::before {
        @apply -rotate-90;
      }
    }
  }

  &.bg-yellow,
  &.bg-white {

    a,
    a.rich-arrow--link {
      &:hover {
        @apply text-blue-dark;
      }
    }
  }
}

/* Bouton jaune */
a.rich-yellow--button {
  @apply inline-flex items-center justify-between gap-2 font-shoulders font-semibold uppercase text-[1.5rem] leading-8 text-secondary bg-info rounded-md px-4 py-2 transition-colors duration-200 no-underline;
}

a.rich-yellow--button:hover {
  @apply bg-yellow;
}

/* Icône flèche du bouton */
a.rich-yellow--button::after {
  content: "";
  @apply inline-block w-8 h-8;
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
