<template>
  <div class="maxed padded my-8">
    <iframe
      id="haWidget"
      allowtransparency="true"
      src="https://www.helloasso.com/associations/open-roller-derby-association/evenements/men-s-roller-derby-world-cup-2026-coupe-du-monde-masculine-roller-derby-2026/widget"
      style="width: 100%; border: none;"
      onload="window.addEventListener( 'message', function(e) { const dataHeight = e.data.height; const haWidgetElement = document.getElementById('haWidget'); haWidgetElement.height = dataHeight + 'px'; } )"
    ></iframe>
  </div>
</template>

<script lang="ts" setup>
</script>

<style></style>