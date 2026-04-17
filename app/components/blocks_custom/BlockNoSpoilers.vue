<template>
    <div class="maxed padded">
        <div class="bg-white text-black text-sm rounded-2xl p-4 my-8 w-fit">
            <p class="font-shoulders font-bold">
                <span class="text-lg mr-2">{{ t('no_spoiler_mode.title') }}</span>
                <span :class="statusClasses" class="text-lg uppercase">{{ isNoSpoilerModeActive ?
                    t('no_spoiler_mode.enabled') :
                    t('no_spoiler_mode.disabled') }}</span>
            </p>
            <p class="leading-tight mt-1 mb-3">{{ description }}</p>
            <button @click="toggleNoSpoilerMode" :class="buttonClasses"
                class="font-shoulders font-semibold uppercase text-sm pl-2 pr-4 py-2 rounded-md inline-flex items-center gap-2 cursor-pointer select-none">
                <UIcon v-show="isNoSpoilerModeActive" name="i-lucide-eye" class="size-4" />
                <UIcon v-show="!isNoSpoilerModeActive" name="i-lucide-eye-off" class="size-4" />
                <span>{{ toggleText }}</span>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
const { isNoSpoilerModeActive, toggleNoSpoilerMode } = useNoSpoilerMode();
const { t } = useI18n();

const toggleText = computed(() => !isNoSpoilerModeActive.value ? t('no_spoiler_mode.hide_spoilers') : t('no_spoiler_mode.show_spoilers'));
const description = computed(() => isNoSpoilerModeActive.value ? t('no_spoiler_mode.enabled_description') : t('no_spoiler_mode.disabled_description'));

const statusClasses = computed(() => isNoSpoilerModeActive.value ? 'text-blue-light' : 'text-red-text');
const buttonClasses = computed(() => isNoSpoilerModeActive.value ? 'bg-red-text text-white' : 'bg-yellow text-black');
</script>