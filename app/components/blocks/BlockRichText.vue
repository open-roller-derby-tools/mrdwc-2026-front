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
  if (props.data.background_style === "card") {
    classes.push("mb-6 last:mb-0")
  }

  if (
    props.data.background_style === "card" &&
    props.data.background_section === "light_blue"
  ) {
    classes.push("bg-blue-text py-6")
  }
  if (props.data.background_style === "card") {
    classes.push("mb-6 last:mb-0")
  }

  if (
    props.data.background_style === "card" &&
    props.data.background_section === "light_blue"
  ) {
    classes.push("bg-blue-text py-6")
  }
  return classes.join(" ")
})

const elementClasses = computed(() => {
  const classes: string[] = []
  // Set color and add padding if background_style is "card"
  if (props.data.background_style == "card") {
    classes.push(" px-6 py-6 rounded-2xl")
    classes.push(" px-6 py-6 rounded-2xl")
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

.block-rich-text {
  h4 {
    @apply text-yellow;
  }

  ul {
    @apply mb-4;

    li {
      @apply text-base sm:text-lg;
    }
  }

  p {
    @apply mb-4 last:mb-0 text-base sm:text-lg;
  }

  em {
    @apply text-yellow;
  }

  hr {
    @apply my-4 sm:my-10;
  }

  img.rich-img--full {
    @apply w-full sm:w-1/2;

    &.img-center {
      @apply block mx-auto;
    }
  }

  .full-iframe {
    @apply w-full block border-0 h-[300px] sm:h-[600px];
  }

  a:not(.rich-yellow--button) {
    @apply relative inline-block transition-all duration-200;

    &::after {
      @apply content-[''] absolute left-0 bottom-0 h-0.5 bg-yellow w-1/3 transition-all duration-300 ease-in-out;
    }

    &:hover::after {
      @apply w-full;
    }

    &:hover {
      @apply text-yellow;
    }
  }

  a.rich-arrow--link {
    @apply inline-flex text-white items-center gap-1 font-shoulders p-0 transition-colors duration-200 uppercase text-2xl -ml-2 after:hidden;

    &::before {
      @apply content-[''] inline-block w-8 h-8 bg-blue-light mask-[url(/arrow-down-right.svg)] mask-no-repeat mask-center mask-contain transition-transform duration-200;
    }

    &:hover {
      &::before {
        @apply -rotate-90;
      }
    }

    &.lowcase-link {
      @apply font-cabin normal-case text-base sm:text-lg;

      &::before {
        @apply w-6 h-6;
      }
    }
  }

  .bg-yellow {
    h4 {
      @apply text-blue-dark;
    }

    a.rich-arrow--link:hover {
      @apply text-blue-dark;
    }

    em {
      @apply text-blue-dark;
    }
  }

  .bg-white {
    h4 {
      @apply text-red-light;
    }

    em {
      @apply text-red-text;
    }

    a:not(.rich-yellow--button) {
      &::after {
        @apply bg-red-light;
      }

      &:hover {
        @apply text-red-light;
      }
    }

    &.lowcase-link {
      @apply font-cabin normal-case text-base sm:text-lg;

      &::before {
        @apply w-6 h-6;
      }
    }

    a.rich-arrow--link {
      @apply text-blue-text;

      &:hover {
        @apply text-red-light;
      }
    }
  }
}
</style>
