<template>
	<div class="py-16">
		<div class="maxed padded">
			<div
				v-if="officialsStore.localizedOfficials.length"
				class="space-y-16"
			>
				<BlockOfficialsCrew
					v-for="(crew, index) in officialsStore.localizedOfficials"
					:key="`crew_${index}`"
					:crew-index="index"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import BlockOfficialsCrew from './BlockOfficialsCrew.vue';

const officialsStore = useOfficialsStore();
const { t } = useI18n();
</script>
