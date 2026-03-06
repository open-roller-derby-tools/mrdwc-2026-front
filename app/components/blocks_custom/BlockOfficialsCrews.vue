<template>
	<div class="sm:pt-16">
		<div class="bg-blue-text py-16 sm:pt-0">
			<div class="maxed padded">
				<div
					v-if="officialsStore.localizedOfficials.length"
					class="grid grid-cols-2 sm:flex sm:justify-center gap-2 sm:gap-0.5 mb-6 sm:mb-0 sm:-translate-y-1/2"
				>
					<button
						v-for="(crew, index) in officialsStore.localizedOfficials"
						:key="`crew_select_${index}`"
						:class="[
							'transition-colors duration-200 font-shoulders font-semibold text-center text-xl px-3 sm:px-6 py-2 rounded-xl sm:rounded-none sm:first:rounded-l-xl sm:last:rounded-r-xl w-full sm:w-auto select-none cursor-pointer',
							selectedCrewIndex === index
								? 'bg-yellow text-blue-text'
								: 'bg-blue-inactive text-blue-text hover:bg-yellow'
						]"
						@click="selectedCrewIndex = index"
					>
						{{ crew.name }}
					</button>
				</div>
				<BlockOfficialsCrew
					v-if="officialsStore.localizedOfficials.length"
					:crew-index="selectedCrewIndex"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import BlockOfficialsCrew from './BlockOfficialsCrew.vue';

const officialsStore = useOfficialsStore();

const selectedCrewIndex = ref(0);
</script>
