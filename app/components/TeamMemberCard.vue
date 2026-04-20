<template>
  <div
    class="group flex flex-col h-full overflow-hidden hover:shadow-xl transition-all duration-300"
    :class="[
      'group flex flex-col h-full overflow-hidden transition-all duration-300',
      borderClass,
      roundedClass,
      oddFixClass,
    ]"
  >
    <!-- IMAGE -->
    <div
      class="aspect-square flex-shrink-0 bg-blue-inactive border-b-0 border flex justify-center relative overflow-hidden"
      :class="imageRoundedClass"
    >
      <!-- FALLBACK LOGO TEAM -->
      <NuxtImg
        v-if="teamLogo"
        :src="`${config.public.apiBase}/assets/${teamLogo}?width=300&quality=70`"
        :alt="displayName"
        class="absolute inset-0 w-full h-full object-contain opacity-70 mix-blend-multiply grayscale transition-opacity duration-300"
        :class="isLoaded ? 'opacity-0' : 'opacity-70'"
      />

      <!-- PHOTO -->
      <NuxtImg
        v-if="member.rosterPhoto"
        :src="`${config.public.apiBase}/assets/${member.rosterPhoto}?width=300&quality=70`"
        :alt="displayName"
        loading="lazy"
        @load="isLoaded = true"
        class="absolute inset-0 w-full h-full object-cover object-top transition-all duration-500"
        :class="isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'"
      />
    </div>

    <!-- INFOS -->
    <div
      class="p-2 sm:p-4 bg-white flex-1 text-center flex flex-col items-center justify-center min-h-[65px] sm:min-h-[90px]"
    >
      <div
        v-if="member.number && !isStaffLike"
        class="text-red-light font-bold text-lg"
      >
        #{{ member.number || "—" }}
      </div>

      <div class="text-blue-text uppercase font-semibold text-sm sm:text-lg">
        {{ displayName }}
      </div>

      <!-- BENCH STAFF -->
      <div
        v-if="isBenchStaff"
        class="text-sm sm:text-lg text-red-light font-semibold uppercase tracking-wide"
      >
        Bench Staff
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ILocalizedTeamMember } from "~~/types/custom";

const props = defineProps<{
  member: ILocalizedTeamMember;
  teamLogo?: string | null;
  index?: number;
  total?: number;
  isGrid?: boolean;
  itemsPerRow?: number;
}>();

const config = useRuntimeConfig();

const isLoaded = ref(false);

/**
 * Nom affiché :
 * derbyname > firstname
 */
const displayName = computed(() => {
  return props.member.derbyname?.trim() || props.member.firstname || "Unknown";
});

/**
 * Détection bench staff
 */
const isBenchStaff = computed(() => {
  return props.member.roles?.some((role) =>
    role.toLowerCase().includes("bench"),
  );
});

const isStaffLike = computed(() => {
  return props.member.roles?.some((role) => {
    const r = role.toLowerCase();
    return r.includes("staff") || r.includes("bench");
  });
});

const gridMeta = computed(() => {
  const index = props.index ?? 0;
  const total = props.total ?? 0;
  const perRow = props.itemsPerRow ?? 2;

  const row = Math.floor(index / perRow);
  const col = index % perRow;

  const totalRows = Math.ceil(total / perRow);
  const lastRow = totalRows - 1;

  // ⚠️ nombre réel d’items sur la dernière ligne
  const itemsInLastRow = total % perRow || perRow;
  const lastCol = row === lastRow ? itemsInLastRow - 1 : perRow - 1;

  return {
    row,
    col,
    lastRow,
    lastCol,
  };
});

const isOddLastAlone = computed(() => {
  const total = props.total ?? 0;
  const perRow = props.itemsPerRow ?? 2;

  return total % perRow === 1;
});

const isLast = computed(() => props.index === (props.total ?? 0) - 1);
const isSecondLast = computed(() => props.index === (props.total ?? 0) - 2);

const roundedClass = computed(() => {
  if (!props.isGrid) return "rounded-xl shadow-lg";

  const { row, col, lastRow, lastCol } = gridMeta.value;

  let classes = "rounded-none";

  if (row === 0 && col === 0) classes += " rounded-tl-xl";
  if (row === 0 && col === lastCol) classes += " rounded-tr-xl";
  if (row === lastRow && col === 0) classes += " rounded-bl-xl";
  if (row === lastRow && col === lastCol) classes += " rounded-br-xl";

  if (isOddLastAlone.value && isSecondLast.value) {
    classes += " rounded-br-xl";
  }

  return classes;
});

const borderClass = computed(() => {
  if (!props.isGrid) return "";

  const { row, col, lastRow, lastCol } = gridMeta.value;

  let classes = "";

  // 🎯 TOP
  if (row === 0) {
    classes += " border-t-2";
  } else {
    classes += " border-t";
  }

  // 🎯 BOTTOM
  if (row === lastRow) {
    classes += " border-b-2";
  }

  // 🎯 LEFT
  if (col === 0) {
    classes += " border-l-2 border-r border-b-1";
  } else {
    classes += " border-l border-r-2 border-b-1";
  }

  // 🎯 RIGHT
  if (col === lastCol) {
    classes += " border-r-2 border-b-1";
  }

  // 🎨 couleur
  classes += " border-transparent";

  return classes;
});

const oddFixClass = computed(() => {
  if (!props.isGrid) return "";

  if (isOddLastAlone.value && isLast.value) {
    return "col-span-2 w-[calc(50%+1px)]";
  }

  return "";
});

const imageRoundedClass = computed(() => {
  if (!props.isGrid) return "border-white/30 rounded-t-xl";

  const { row, col, lastCol } = gridMeta.value;

  let classes = "border-white rounded-none";

  // 👉 première card de la grille
  if (row === 0 && col === 0) {
    classes += " rounded-tl-xl";
  }

  // 👉 dernière card de la row
  if (row === 0 && col === lastCol) {
    classes += " rounded-tr-xl";
  }

  return classes;
});
</script>
