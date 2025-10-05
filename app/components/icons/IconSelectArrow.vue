<template>
  <div
    class="transition-transform duration-150 ease-out origin-[50%_42%]"
    :class="dynamicClasses"
  >
    <svg
      viewBox="0 0 12 10"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M11.3996 0.101962L0.599332 0.101961C0.489984 0.102304 0.3828 0.132516 0.289318 0.189343C0.195835 0.246171 0.119593 0.327461 0.0687998 0.424467C0.0180061 0.521473 -0.00541708 0.630519 0.00105359 0.739868C0.0075233 0.849216 0.0436408 0.954727 0.105518 1.04504L5.50567 8.85898C5.72948 9.18295 6.26829 9.18295 6.4927 8.85898L11.8929 1.04504C11.9554 0.954917 11.992 0.849353 11.9988 0.739822C12.0057 0.630291 11.9824 0.520982 11.9315 0.423771C11.8807 0.32656 11.8042 0.245165 11.7105 0.18843C11.6167 0.131694 11.5092 0.101788 11.3996 0.101962Z" />
    </svg>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  open: boolean;
}>();

const dynamicClasses = computed(() => {
  return { "rotate-180": props.open };
});
</script>

<style></style>
