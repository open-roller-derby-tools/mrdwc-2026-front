<template>
  <component
    :is="isExternal ? 'a' : NuxtLink"
    :href="isExternal ? to : undefined"
    :to="!isExternal ? to : undefined"
    :target="target"
    class="flex gap-2 items-center group cursor-pointer"
  >
    <div class="w-fit">
      <IconArrow
        class="text-blue-light w-6 rotate-45 transition-transform duration-200 group-hover:-rotate-45"
      />
    </div>
    <span class="font-shoulders font-medium text-xl sm:text-2xl">{{
      label
    }}</span>
  </component>
</template>

<script lang="ts" setup>
import IconArrow from "./icons/IconArrow.vue"
import { computed } from "vue"
import { NuxtLink } from "#components"

const props = defineProps<{
  label: string
  to: string
  target?: string
}>()

const isExternal = computed(() => /^https?:|^mailto:|^tel:/i.test(props.to))
</script>
