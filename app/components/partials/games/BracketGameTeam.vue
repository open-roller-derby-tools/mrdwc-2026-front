<template>
    <div :style="divStyle" class="flex items-center justify-center uppercase">
        {{ teamName }}
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    teamName: string;
    teamColor: string;
}>();

const textColor = useContrastingColor(computed(() => props.teamColor));

const divStyle = computed(() => ({
    backgroundColor: props.teamColor,
    color: textColor.value,
}));
</script>