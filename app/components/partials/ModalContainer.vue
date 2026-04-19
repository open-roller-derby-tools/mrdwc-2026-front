<template>
  <Teleport to="body">
    <Transition
      enter-from-class="opacity-0"
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-blue/50"
        @click="onBackdropClick"
      >
        <div @click.stop class="max-w-screen p-4">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    show: boolean;
    closeOnBackdrop?: boolean;
  }>(),
  {
    closeOnBackdrop: true,
  },
);

const emit = defineEmits<{
  close: [];
}>();

const onBackdropClick = () => {
  if (props.closeOnBackdrop) {
    emit("close");
  }
};

watch(
  () => props.show,
  (isVisible) => {
    document.body.style.overflow = isVisible ? "hidden" : "";
  },
);

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>
