<template>
  <div
    class="flex items-center gap-1 text-sm font-medium"
    :class="gameTimeOrStateClass"
  >
    <div v-if="gameIsLive && gameTimeOrStateIcon" class="relative inline-flex">
      <UIcon
        :name="gameTimeOrStateIcon"
        class="absolute size-4 opacity-75 animate-ping"
      />
      <UIcon :name="gameTimeOrStateIcon" class="size-4" />
    </div>
    <template v-else-if="gameTimeOrStateIcon">
      <UIcon :name="gameTimeOrStateIcon" class="size-4" />
    </template>
    <span class="overflow-hidden text-ellipsis whitespace-nowrap">{{
      gameTimeOrStateLabel
    }}</span>
  </div>
</template>

<script lang="ts" setup>
import { GameState, type IGame } from "~~/types/games";

const { formatTime } = useFormatTimeLocalized();
const { t } = useI18n();

const props = defineProps<{
  game: IGame;
  withBackground: boolean;
  showTime: boolean;
}>();

const gameIsLive = computed(() => {
  return (
    props.game.state === GameState.InProgressP1 ||
    props.game.state === GameState.HalfTime ||
    props.game.state === GameState.InProgressP2
  );
});

const gameTimeOrStateLabel = computed(() => {
  switch (props.game.state) {
    case GameState.Scheduled:
    case GameState.PreGame:
      return props.showTime
        ? formatTime(props.game.start_time)
        : t("game_state.scheduled");
    case GameState.InProgressP1:
      return t("game_state.in_progress_p1");
    case GameState.HalfTime:
      return t("game_state.half_time");
    case GameState.InProgressP2:
      return t("game_state.in_progress_p2");
    case GameState.Finished:
      return t("game_state.finished");
    default:
      return "";
  }
});

const gameTimeOrStateIcon = computed<string | false>(() => {
  switch (props.game.state) {
    case GameState.Scheduled:
    case GameState.PreGame:
      return "ic:round-schedule";
    case GameState.InProgressP1:
    case GameState.InProgressP2:
      return "ic:round-fiber-manual-record";
    case GameState.HalfTime:
      return "ic:round-pause";
    case GameState.Finished:
      return "ic:round-done";
    default:
      return false;
  }
});

const gameTimeOrStateClass = computed<string>(() => {
  const bgClass = " px-1 py-0.5 rounded-b-md";
  switch (props.game.state) {
    case GameState.InProgressP1:
    case GameState.InProgressP2:
      return `text-red-base ${props.withBackground ? "bg-white" + bgClass : ""}`;
    case GameState.HalfTime:
      return `text-blue-text ${props.withBackground ? "bg-white" + bgClass : ""}`;
    default:
      return `text-black ${props.withBackground ? "bg-yellow" + bgClass : ""}`;
  }
});
</script>
