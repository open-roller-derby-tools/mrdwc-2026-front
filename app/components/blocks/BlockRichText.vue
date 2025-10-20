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
  return classes.join(" ")
})

const elementClasses = computed(() => {
  const classes: string[] = []
  // Set color and add padding if background_style is "card"
  if (props.data.background_style == "card") {
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
  }

  p {
    @apply mb-4 last:mb-0 text-base sm:text-lg;
  }

  em {
    @apply text-yellow;
  }

  li {
    @apply relative pl-3 before:content-['•'] before:absolute before:left-0 text-base sm:text-lg;
  }

  hr {
    @apply my-4 sm:my-10;
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
      @apply font-cabin lowercase text-base sm:text-lg;
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
  }

  .bg-white {
    h4 {
      @apply text-red-light;
    }

    a:not(.rich-yellow--button) {
      &::after {
        @apply bg-red-light;
      }

      &:hover {
        @apply text-red-light;
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

/* Bouton jaune */
a.rich-yellow--button {
  @apply relative z-10 overflow-hidden inline-flex items-center justify-between gap-2 font-shoulders font-semibold uppercase text-[1.5rem] leading-8 text-secondary bg-info rounded-md px-4 py-2 transition-colors duration-200 no-underline after:hidden hover:text-blue-text;
}

a.rich-yellow--button:hover {
  @apply bg-yellow w-auto;
}

a.rich-yellow--button::after {
  content: "";
  @apply inline-block w-8 h-8 relative;
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
