<template>
    <div class="bg-blue-text text-base sm:text-lg py-3">
        <div class="maxed padded">
            <ul class="list-none">
                <li v-for="(venue, index) in venuesStore.venues" :key="venue.id" class="leading-tight my-1">
                    <span class="font-shoulders font-bold text-lg mr-1">
                        {{ t('calendar_test', {
                            index: index + 1,
                            count: 2
                        }) }}</span>
                    <a :href="venue.map_url" target="_blank" class="">
                        <span class="font-bold text-yellow mr-2">{{ venue.name }}</span>
                        <span class="italic">{{ venue.address
                            }}</span></a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useVenuesStore } from '~/stores/venues';

const { t } = useI18n();
const venuesStore = useVenuesStore();
</script>