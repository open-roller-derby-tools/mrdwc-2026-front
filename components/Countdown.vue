<template>
  <div>
    <p>{{ $d(startDate, "ddmy") }}</p>
    <hr />
    <p>{{ timeRemaining.days }} days</p>
    <p>{{ timeRemaining.hours }} hours</p>
    <p>{{ timeRemaining.minutes }} minutes</p>
    <p>{{ timeRemaining.seconds }} seconds</p>
  </div>
</template>

<script lang="ts" setup>
import { differenceInSeconds } from "date-fns";
import { TZDate } from "@date-fns/tz";

const startDate = new TZDate(2026, 3, 30, 0, 0, 0, "Europe/Paris");
// const endDate = new TZDate(2026, 4, 3, 0, 0, 0, "Europe/Paris");

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
