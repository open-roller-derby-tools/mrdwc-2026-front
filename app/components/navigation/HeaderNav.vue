<template>
	<div
		class="w-full h-[100px] z-90 absolute p-3 before:content-[''] before:fixed before:t-0 before:h-[100px] before:inset-0 before:bg-gradient-to-b before:from-[#121356] before:to-transparent before:transition-opacity before:duration-500"
	>
		<!-- Logo -->
		<NuxtLinkLocale href="/" class="inline-block sm:hidden">
			<NuxtImg
				src="/mrdwc_logo@2x.png"
				:alt="t('image_alts.image_logo')"
				class="w-[120px] z-100 relative self-center sm:self-auto"
			/>
		</NuxtLinkLocale>
		<USlideover
			v-if="smOrSmaller"
			v-model:open="open"
			:close="{
				variant: 'ghost',
				icon: 'i-lucide-x',
				size: 'xxl',
				class:
					'absolute text-2xl top-3 right-4 items-center justify-center text-white hover:bg-blue-text active:bg-blue-text rounded-full p-0',
			}"
			side="right"
		>
			<UButton
				color="info"
				variant="solid"
				icon="i-lucide-menu"
				size="xxl"
				class="fixed top-4 right-4 p-3 items-center justify-center z-100 text-white bg-red-light/70 border-1 border-white/20 hover:bg-red-light active:bg-red-light rounded-full backdrop-blur-sm shadow-lg"
			/>
			<template #title>
				<LangSwitcher class="" />
			</template>
			<template #body>
				<HeaderMenu @link-selected="closeSlideover"></HeaderMenu>
			</template>
		</USlideover>
		<HeaderMenu v-else></HeaderMenu>
	</div>
</template>

<script lang="ts" setup>
import LangSwitcher from "./LangSwitcher.vue";
import HeaderMenu from "./HeaderMenu.vue";
import { useResponsive } from "~/composables/useResponsive";

const { t } = useI18n();
const { smOrSmaller } = useResponsive();

const open = ref(false);
const closeSlideover = () => {
	open.value = false;
};
</script>

<style></style>
