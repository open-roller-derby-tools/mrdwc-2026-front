<template>
  <div class="flex gap-4 rounded-2xl border-2 border-white p-8">
    <DatesDate :date="startDate"></DatesDate>
    <DatesDate :date="endDate"></DatesDate>
  </div>
</template>

<script lang="ts" setup>
const startDate = new Date(2026, 3, 30, 0, 0, 0);
const endDate = new Date(2026, 4, 3, 0, 0, 0);
</script>

<style></style>