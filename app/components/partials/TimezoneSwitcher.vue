<template>
    <div class="p-4 bg-white text-black rounded-2xl">
        <p class="font-shoulders font-bold sm:text-lg text-balance flex items-center gap-2 leading-tight">
            <span>{{ t('calendar.current_timezone', { timezone: active_timezone }) }}</span>
        </p>
        <p v-if="user_timezone !== tournament_timezone"
            class="mt-2 flex flex-col gap-0 sm:gap-1 sm:flex-row sm:items-center cursor-pointer font-bold text-lg sm:text-base"
            @click="toggleTimezone">
            <UIcon name="i-ic-round-swap-horiz" class="size-6 hidden sm:block text-red-text" />
            <span class="underline underline-offset-2 text-red-text">{{ active_timezone === tournament_timezone
                ?
                t('calendar.use_user_timezone', {
                    timezone: user_timezone
                }) : t('calendar.use_tournament_timezone')
            }}</span>
            <span class="font-normal italic">({{ active_timezone === tournament_timezone ? user_timezone :
                tournament_timezone }})</span>
        </p>
    </div>
</template>

<script lang="ts" setup>
const { active_timezone, tournament_timezone, user_timezone, toggleTimezone } = useTimezone();
const { t } = useI18n();
</script>