<template>
    <div class="relative flex flex-col justify-center" :style="bracketHeight">
        <div class="flex flex-row">
            <div class="flex items-center justify-center px-2 bg-blue-text text-white">G42</div>
            <div class="flex flex-col w-full">
                <BracketGameTeam :teamName="home_team" :teamColor="home_color" :style="`height: ${TEAM_HEIGHT}px`" />
                <BracketGameTeam :teamName="away_team" :teamColor="away_color" :style="`height: ${TEAM_HEIGHT}px`" />
            </div>
        </div>
        <svg v-if="show_link"
            class="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-full w-full h-full text-yellow"
            viewBox="0 0 100 100" preserveAspectRatio="none" stroke-width="2" stroke-linejoin="round"
            stroke="currentColor" fill="none">
            <polyline points="0,25 50,25 50,75 0,75" vector-effect="non-scaling-stroke" />
            <line x1="50" y1="50" x2="100" y2="50" vector-effect="non-scaling-stroke" />
        </svg>
    </div>
</template>

<script lang="ts" setup>
import BracketGameTeam from './BracketGameTeam.vue';

const TEAM_HEIGHT = 30
const WRAPPER_HEIGHT = 80

const props = withDefaults(defineProps<{
    home_team?: string;
    away_team?: string;
    home_color?: string;
    away_color?: string;
    show_link?: boolean;
    level?: number;
}>(), {
    home_team: "TEAM A",
    away_team: "TEAM B",
    home_color: "#000000",
    away_color: "#FFFFFF",
    show_link: false,
    level: 1,
});

const bracketHeight = computed(() => ({
    height: `${WRAPPER_HEIGHT * Math.pow(2, props.level - 1)}px`,
}))

</script>
