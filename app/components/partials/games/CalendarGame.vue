<template>
    <div class="flex flex-col h-full bg-yellow rounded-md px-2">
        <p>{{ event.title }}</p>
        <p>{{ formatTime(event.start) }}</p>
        <p>{{ formatTime(event.end) }}</p>
    </div>
</template>

<script lang="ts" setup>
import { format } from 'date-fns';

const props = defineProps<{
    event: {
        title: string;
        start: Date;
        end: Date;
    };
}>();

const formatTime = (time: Date): string => {
    return format(time, "HH:mm");
};
</script>