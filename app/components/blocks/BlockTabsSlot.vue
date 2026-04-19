<template>
  <div :id="data.anchor_id" :class="[data.classes, 'relative']">
    <!-- Fond bleu desktop -->
    <div
      class="absolute hidden sm:block inset-x-0 top-[22px] h-[22px] bg-blue-text"
    ></div>

    <!-- VERSION MOBILE -->
    <div class="sm:hidden relative z-10 maxed mb-6">
      <div
        v-for="tab in data.tabs"
        :key="tab.slotKey"
        class="mt-0.5 first:mt-0"
      >
        <button
          :data-slug="tab.slotKey"
          :class="[
            'flex items-center justify-between w-full px-6 py-3 text-blue-text font-shoulders font-semibold text-xl transition-colors duration-200',
            openTab === tab.slotKey
              ? 'bg-yellow text-blue-text'
              : 'bg-blue-light text-white',
          ]"
          @click="toggleTab(tab.slotKey)"
        >
          <span>{{ tab.label }}</span>

          <UIcon
            name="i-lucide-arrow-right"
            class="size-6 transition-transform duration-200 ease-out"
            :class="{ 'rotate-90': openTab === tab.slotKey }"
          />
        </button>

        <!-- CONTENT MOBILE -->
        <transition name="slide">
          <div v-if="openTab === tab.slotKey" class="overflow-hidden">
            <div class="relative z-10">
              <slot :name="tab.slotKey" />
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- VERSION DESKTOP -->
    <div class="hidden sm:block relative z-10">
      <nav>
        <ul
          class="maxed padded py-0 mt-6 flex flex-col sm:flex-row gap-0.5 items-center list-none"
        >
          <li
            v-for="tab in data.tabs"
            :key="tab.slotKey"
            :data-slug="tab.slotKey"
            class="transition-colors duration-100 font-shoulders font-semibold text-xl px-3 py-2 w-full sm:w-auto flex gap-4 items-center select-none cursor-pointer first:rounded-t-xl last:rounded-b-xl sm:first:rounded-tr-none sm:first:rounded-bl-xl sm:last:rounded-bl-none sm:last:rounded-tr-xl"
            :class="[
              activeTab === tab.slotKey
                ? 'bg-yellow text-blue-text'
                : 'bg-blue-inactive text-blue-text hover:bg-yellow transition-all duration-200',
            ]"
            @click="activateTab(tab.slotKey)"
          >
            {{ tab.label }}

            <UIcon
              name="i-lucide-arrow-right"
              class="size-7 transition-transform duration-200 ease-out"
              :class="{ 'rotate-90': activeTab === tab.slotKey }"
            />
          </li>
        </ul>
      </nav>

      <!-- CONTENT DESKTOP -->
      <div class="relative z-10">
        <slot :name="activeTab" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ILocalizedBlockTabsSlot } from "~~/types/custom";

const props = defineProps<{
  data: ILocalizedBlockTabsSlot;
}>();

/**
 * DESKTOP + MOBILE STATES
 */
const activeTab = ref(props.data.tabs[0]?.slotKey ?? "");
const openTab = ref<string | null>(props.data.tabs[0]?.slotKey ?? null);

/**
 * DESKTOP
 */
const activateTab = (key: string) => {
  activeTab.value = key;
  openTab.value = key;
};

/**
 * MOBILE (accordion behavior identique BlockTabs.vue)
 */
const toggleTab = async (key: string) => {
  const wasOpen = openTab.value === key;
  openTab.value = wasOpen ? null : key;

  if (!wasOpen) {
    activeTab.value = key;
  }
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  opacity: 1;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
