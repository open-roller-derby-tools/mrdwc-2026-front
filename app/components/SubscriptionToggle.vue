<template>
	<button
		:disabled="disabled"
		class="group flex items-center text-md gap-2 px-3 py-2 rounded-xl font-semibold transition-all duration-300 cursor-pointer border"
		:class="[
			disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : '',
			isActive ? activeClass : inactiveClass,
		]"
		@click="toggle"
	>
		<UIcon
			:name="isActive ? 'i-lucide-bell' : 'i-lucide-bell-off'"
			class="size-7 transition-all duration-300 origin-center"
			:class="[isActive ? 'scale-110 rotate-20' : 'animate-bell group-hover:scale-115']"
		/>

		{{ isActive ? activeLabel : inactiveLabel }}
	</button>
</template>

<script setup lang="ts">
const props = defineProps<{
	modelValue: boolean;
	activeLabel?: string;
	inactiveLabel?: string;
	disabled?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const isActive = computed(() => props.modelValue);

const activeLabel = computed(() => props.activeLabel ?? "On");
const inactiveLabel = computed(() => props.inactiveLabel ?? "Off");
const disabled = computed(() => props.disabled ?? false);

const toggle = () => {
	if (disabled.value) return;
	emit("update:modelValue", !props.modelValue);
};

/**
 * Styles
 */
const activeClass = "bg-yellow text-blue-text border-blue-text";

const inactiveClass =
	"bg-blue-inactive text-blue-text border-blue-inactive hover:bg-red-200 hover:text-red-light hover:border-red-light";
</script>
