<template>
	<div class="flex items-center justify-center w-full h-full">
		<UIcon name="ic:round-help" class="size-5 cursor-pointer" @click="openRankingsHelpModal" />
	</div>
	<ModalContainer :show="showRankingsHelpModal" @close="showRankingsHelpModal = false">
		<div
			class="rounded-2xl bg-white p-4 sm:p-6 text-black shadow-2xl flex flex-col gap-4 w-fit max-w-full mx-auto"
		>
			<p class="text-xl font-bold">{{ t("rankings.legend") }}</p>
			<ul class="list-none text-sm">
				<li class="text-green-700">
					<span
						class="inline-flex items-center justify-center w-3 h-3 rounded-sm bg-green-50 border border-green-700"
						>×</span
					>
					{{ t("rankings.bracket_play") }}
				</li>
				<li class="text-blue-700">
					<span
						class="inline-flex items-center justify-center w-3 h-3 rounded-sm bg-blue-100 border border-blue-700"
						>×</span
					>
					{{ t("rankings.rankings_play") }}
				</li>
				<li class="text-red-700">
					<span
						class="inline-flex items-center justify-center w-3 h-3 rounded-sm bg-red-50 border border-red-700"
						>×</span
					>
					{{ t("rankings.eliminated") }}
				</li>
			</ul>

			<ul class="list-none text-sm">
				<li class="sm:hidden">
					<span class="font-bold">{{ t("rankings.played_short") }}</span> -
					{{ t("rankings.played") }}
				</li>
				<li class="sm:hidden">
					<span class="font-bold">{{ t("rankings.won_short") }}</span> - {{ t("rankings.won") }}
				</li>
				<li class="sm:hidden">
					<span class="font-bold">{{ t("rankings.lost_short") }}</span> - {{ t("rankings.lost") }}
				</li>
				<!-- <li class=""><span class="font-bold">{{ t("rankings.for_short") }}</span> - {{ t("rankings.for") }}</li> -->
				<!-- <li class=""><span class="font-bold">{{ t("rankings.against_short") }}</span> - {{ t("rankings.against") }}</li> -->
				<li class="hidden sm:block">
					<span class="font-bold">{{ t("rankings.diff") }}</span> - {{ t("rankings.diff_full") }}
				</li>
				<li>
					<span class="font-bold">{{ t("rankings.adj_short") }}</span> -
					{{ t("rankings.adj_full") }}
				</li>
			</ul>
		</div>
	</ModalContainer>
</template>

<script lang="ts" setup>
import ModalContainer from "./ModalContainer.vue";

const { t } = useI18n();

const showRankingsHelpModal = ref(false);

const openRankingsHelpModal = () => {
	showRankingsHelpModal.value = true;
};
</script>
