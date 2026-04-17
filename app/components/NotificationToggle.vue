<template>
  <button
    @click="toggle"
    class="group flex items-center text-md gap-2 px-3 py-2 rounded-xl font-semibold transition-all duration-300 cursor-pointer border"
    :class="isActive ? activeClass : inactiveClass"
  >
    <UIcon
      :name="isActive ? 'i-lucide-bell' : 'i-lucide-bell-off'"
      class="size-7 transition-all duration-300 origin-center"
      :class="[
        isActive ? 'scale-110 rotate-20' : 'animate-bell group-hover:scale-115',
      ]"
    />

    {{ isActive ? activeLabel : inactiveLabel }}
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  activeLabel: { type: String, default: "On" },
  inactiveLabel: { type: String, default: "Off" },
});

const emit = defineEmits(["update:modelValue"]);

const isActive = computed(() => props.modelValue);

const toggle = () => {
  emit("update:modelValue", !props.modelValue);
};

/**
 * Styles
 */
const activeClass = "bg-yellow text-blue-text border-blue-text";

const inactiveClass =
  "bg-blue-inactive text-blue-text border-blue-inactive hover:bg-red-200 hover:text-red-light hover:border-red-light";
</script>
