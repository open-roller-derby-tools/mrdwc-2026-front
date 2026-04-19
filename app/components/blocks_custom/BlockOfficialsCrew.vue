<template>
	<div class="rounded-xl bg-white p-6 sm:p-8 text-blue-text">
		<h2
v-if="crew && displayedName" class="text-red-text select-none normal-case"
			:style="crew?.color ? { color: crew.color } : {}" @click="clickCount++">
			{{ displayedName }}
		</h2>
		<div
v-if="crew && (crew.members_so.length || crew.members_nso.length)"
			class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
			<!-- Skating Officials -->
			<div v-if="crew.members_so.length" class="">
				<OfficialRow v-for="(official, i) in crew.members_so" :key="`nso_${i}`" :official="official">
				</OfficialRow>
			</div>
			<!-- Non-Skating Officials -->
			<div v-if="crew.members_nso.length" class="flex flex-col gap-1">
				<OfficialRow v-for="(official, i) in crew.members_nso" :key="`nso_${i}`" :official="official">
				</OfficialRow>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { ILocalizedOfficialsCrew } from "~~/types/custom";
import OfficialRow from "../partials/OfficialRow.vue";

const officialsStore = useOfficialsStore();
const { t } = useI18n();

const props = defineProps<{
	crewIndex?: number;
}>();

const crew = computed((): ILocalizedOfficialsCrew | undefined => {
	const index = props.crewIndex ?? 0;
	return officialsStore.localizedOfficials[index];
});

const clickCount = ref(0);

const displayedName = computed(() => {
	if (clickCount.value >= 7 && crew.value?.secret_name) {
		return crew.value.secret_name;
	}
	return crew.value?.name || 'Crew';
});
</script>
