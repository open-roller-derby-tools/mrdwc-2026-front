<template>
  <div class="relative flex flex-col h-full select-none">
    <div
      class="grow p-4 rounded-t-md bg-white flex items-center justify-center"
    >
      <p class="font-shoulders text-xl text-red-text font-bold">
        {{ event.title }}
      </p>
    </div>
    <div
      class="bg-yellow text-black flex items-center gap-1 text-sm font-medium px-1 py-0.5 rounded-b-md"
    >
      <UIcon name="ic:round-schedule" class="size-4" />
      <span class="overflow-hidden text-ellipsis whitespace-nowrap">{{
        eventTimeLabel
      }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedEvent } from "~~/types/events";

const props = defineProps<{
  event: {
    title: string;
    start: Date;
    end: Date;
    extendedProps: {
      event: ILocalizedEvent;
    };
  };
}>();

const { formatTime } = useFormatTimeLocalized();
const eventTimeLabel = computed(() => {
  return formatTime(props.event.start);
});
</script>
