<template>
    <div :style="divStyle" class="flex items-center justify-center uppercase">
        {{ teamName ?? "TEAM" }}
    </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
    teamName: string | null;
    teamColor?: string;
}>(), {
    teamColor: "#808080",
});

const textColor = useContrastingColor(computed(() => props.teamColor));

const divStyle = computed(() => ({
    backgroundColor: props.teamColor,
    color: textColor.value,
}));
</script>