<template>
  <div
    class="relative w-full bg-center bg-cover"
    :class="wrapperClasses"
    :style="backgroundStyles"
  >
    <div class="bg-linear-to-b from-blue to-blue-text absolute inset-0 mix-blend-color"></div>
    <div class="bg-linear-to-b from-blue-text/0 to-blue-text from-10% to-90% absolute inset-0"></div>
    <div class="maxed padded">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig();
const img = useImage()

const props = defineProps<{
  image: string | null
}>()

const backgroundStyles = computed(() => {
  const imgUrl = img(`${config.public.apiBase}/assets/${props.image}`)
  return { backgroundImage: `url('${imgUrl}')` }
})

const wrapperClasses = computed(() => {
  return props.image ? "h-48 sm:h-96" : "h-40 sm:h-64"
})
</script>

<style></style>