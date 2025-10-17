<template>
  <div class="maxed padded my-8">
    <iframe
      id="haWidget"
      ref="haWidget"
      allowtransparency="true"
      scrolling="no"
      frameborder="0"
      src="https://www.helloasso.com/associations/open-roller-derby-association/evenements/men-s-roller-derby-world-cup-2026-coupe-du-monde-masculine-roller-derby-2026/widget"
      style="width: 100%; border: none; overflow: hidden"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue"

const haWidget = ref<HTMLIFrameElement | null>(null)

function handleMessage(event: MessageEvent) {
  if (!event.origin.includes("helloasso.com")) return

  const data = event.data
  if (data && data.height && haWidget.value) {
    haWidget.value.style.height = `${data.height + 40}px`
  }
}

onMounted(() => {
  window.addEventListener("message", handleMessage)
})

onBeforeUnmount(() => {
  window.removeEventListener("message", handleMessage)
})
</script>

<style scoped>
iframe {
  display: block;
  width: 100%;
  border: none;
  overflow: hidden;
  transition: height 0.3s ease;
}
</style>
