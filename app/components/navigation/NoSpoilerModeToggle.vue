<template>
	<button
		:class="buttonClasses"
		class="font-shoulders font-semibold uppercase text-sm pl-2 pr-4 py-2 rounded-md inline-flex items-center gap-2 cursor-pointer select-none w-fit h-fit"
		@click="toggleNoSpoilerMode"
	>
		<UIcon v-show="isNoSpoilerModeActive" name="i-lucide-eye" class="size-4" />
		<UIcon v-show="!isNoSpoilerModeActive" name="i-lucide-eye-off" class="size-4" />
		<span>{{ toggleText }}</span>
	</button>
</template>

<script lang="ts" setup>
const { isNoSpoilerModeActive, toggleNoSpoilerMode } = useNoSpoilerMode();
const { t } = useI18n();

const toggleText = computed(() =>
	!isNoSpoilerModeActive.value
		? t("no_spoiler_mode.hide_results")
		: t("no_spoiler_mode.show_results")
);

const buttonClasses = computed(() =>
	isNoSpoilerModeActive.value ? "bg-red-text text-white" : "bg-yellow text-black"
);
</script>
