<template>
  <div
    class="countdown w-full sm:w-md transition-opacity duration-300"
    :class="{ 'fonts-loaded': fontsLoaded }"
  >
    <h3
      v-if="fontsLoaded"
      class="text-yellow uppercase font-shoulders font-semibold"
    >
      {{ t("time_to_derby") }}
    </h3>

    <div
      v-if="fontsLoaded"
      class="bg-white text-red-text rounded-2xl rounded-tl-none font-shoulders p-[0.4em]"
    >
      <div class="flex justify-around">
        <div
          v-for="(value, key) in timeRemaining"
          :key="key"
          class="flex flex-col items-center w-1/4"
        >
          <span class="font-black text-[1.5em] -mt-[0.2em]">{{ value }}</span>
          <span class="uppercase text-[0.5em] -mt-[0.8em]">{{ t(key) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from "vue"
import { differenceInSeconds } from "date-fns"
import { TZDate } from "@date-fns/tz"

const { t } = useI18n()

const startDate = new TZDate(2026, 3, 30, 0, 0, 0, "Europe/Paris")

const MINUTE = 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

const fontsLoaded = ref(false)
const remainingSeconds = ref(0)

function updateRemainingSeconds() {
  const now = new TZDate().withTimeZone("Europe/Paris")
  remainingSeconds.value = differenceInSeconds(startDate, now)
}

const timeRemaining = computed(() => {
  let remaining = remainingSeconds.value
  const d = Math.floor(remaining / DAY)
  remaining -= d * DAY
  const h = Math.floor(remaining / HOUR)
  remaining -= h * HOUR
  const m = Math.floor(remaining / MINUTE)
  remaining -= m * MINUTE
  return {
    days: d,
    hours: h,
    minutes: m,
    seconds: remaining,
  }
})

let updateInterval: NodeJS.Timeout | null = null

onMounted(async () => {
  updateRemainingSeconds()
  updateInterval = setInterval(updateRemainingSeconds, 250)

  // Attendre le chargement complet des polices avant d’afficher
  if (document.fonts) {
    await document.fonts.ready
    fontsLoaded.value = true
  } else {
    setTimeout(() => (fontsLoaded.value = true), 500)
  }
})

onUnmounted(() => {
  if (updateInterval) clearInterval(updateInterval)
  updateInterval = null
})
</script>

<style scoped>
.countdown {
  font-size: min(9vw, 36px);
  opacity: 0;
}
.countdown.fonts-loaded {
  opacity: 1;
}
</style>
