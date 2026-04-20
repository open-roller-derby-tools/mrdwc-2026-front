<template>
	<div :class="page?.classes">
		<div class="bg-blue-text py-4">
			<div class="maxed padded">
				<h2 v-if="page?.show_title" class="relative sm:-left-2.5 flex items-center mb-2">
					<u-icon name="i-lucide-arrow-down-right" class="text-yellow size-8 sm:size-12" />{{
						page?.title
					}}
				</h2>
			</div>
		</div>
		<component
			:is="getBlockComponent(block.collection)"
			v-for="(block, i) in page?.blocks"
			:key="`block_${i}`"
			:data="block"
		></component>
	</div>
</template>

<script lang="ts" setup>
import type { ILocalizedPage } from "~~/types/custom";

defineProps<{
	page: ILocalizedPage | null;
}>();
</script>

<style></style>
