<template>
  <div class="w-full sm:max-w-md">
    <h3 class="text-yellow uppercase font-shoulders font-semibold text-4xl">{{ $t("time_to_derby") }}</h3>
    <div class="bg-white text-red-text rounded-2xl rounded-tl-none font-shoulders p-4 mt-1">
      <div class="flex justify-around">
        <div
          v-for="(value, key) in timeRemaining"
          class="flex flex-col items-center"
        >
          <span class="font-black text-[13dvw] sm:text-6xl -mt-[2dvw] sm:-mt-0">{{ value }}</span>
          <span class="uppercase text-[5dvw] sm:text-2xl -mt-[4dvw] sm:-mt-0">{{ $t(key) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { differenceInSeconds } from "date-fns";
import { TZDate } from "@date-fns/tz";

const startDate = new TZDate(2026, 3, 30, 0, 0, 0, "Europe/Paris");

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

let updateInterval: NodeJS.Timeout | null = null;

const remainingSeconds = ref<number>(0);

function updateRemainingSeconds() {
  const now = new TZDate().withTimeZone("Europe/Paris");
  remainingSeconds.value = differenceInSeconds(startDate, now);
}

const timeRemaining = computed(() => {
  let remaining = remainingSeconds.value;
  const d = Math.floor(remaining / DAY);
  remaining -= d * DAY;
  const h = Math.floor(remaining / HOUR);
  remaining -= h * HOUR;
  const m = Math.floor(remaining / MINUTE);
  remaining -= m * MINUTE;
  return {
    days: d,
    hours: h,
    minutes: m,
    seconds: remaining,
  };
});

onMounted(() => {
  updateRemainingSeconds();
  updateInterval = setInterval(updateRemainingSeconds, 250);
});

onUnmounted(() => {
  if (updateInterval) clearInterval(updateInterval);
  updateInterval = null;
});
</script>

<style></style>
