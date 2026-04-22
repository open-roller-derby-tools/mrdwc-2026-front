<template>
	<div class="fixed inset-0 z-101 pointer-events-none">
		<Transition name="show-backdrop">
			<button
				v-if="isOpen"
				type="button"
				class="absolute inset-0 bg-blue/75 pointer-events-auto"
				aria-label="Close settings drawer"
				@click="isOpen = false"
			/>
		</Transition>
		<div class="absolute w-full bottom-0 left-0 pointer-events-none">
			<button
				type="button"
				class="p-2.5 pt-3 pr-3 flex items-center justify-center rounded-tr-2xl bg-yellow text-black shadow-omni pointer-events-auto"
				@click="isOpen = !isOpen"
			>
				<UIcon name="ic:round-settings" class="size-6" />
			</button>
			<Transition name="drawer-open">
				<div
					v-if="isOpen"
					class="w-full overflow-hidden bg-white text-black rounded-tr-2xl pointer-events-auto"
				>
					<div class="flex flex-col px-4 pb-4 divide-y divide-blue-text/20">
						<div class="py-4 flex items-center justify-between">
							<p class="font-shoulders font-bold uppercase text-sm leading-tight flex flex-col">
								<span>
									{{ $t("no_spoiler_mode.title") }}
								</span>
								<span
									:class="{
										'text-blue-text': isNoSpoilerModeActive,
										'text-red-text': !isNoSpoilerModeActive,
									}"
								>
									{{
										isNoSpoilerModeActive
											? t("no_spoiler_mode.enabled")
											: t("no_spoiler_mode.disabled")
									}}
								</span>
							</p>
							<NoSpoilerModeToggle />
						</div>
						<div class="py-4">
							<TimezoneSwitcher class="" :with-background="false" />
						</div>
						<!-- TODO: Add link to notifications settings page-->
					</div>
				</div>
			</Transition>
		</div>
	</div>
</template>

<script setup lang="ts">
import NoSpoilerModeToggle from "./NoSpoilerModeToggle.vue";
import TimezoneSwitcher from "../partials/TimezoneSwitcher.vue";

const { isNoSpoilerModeActive } = useNoSpoilerMode();
const { t } = useI18n();

const isOpen = ref(false);
</script>

<style scoped>
.drawer-open-enter-active,
.drawer-open-leave-active {
	transition: max-height 0.25s ease;
	overflow: hidden;
}

.drawer-open-enter-from,
.drawer-open-leave-to {
	max-height: 0;
}

.drawer-open-enter-to,
.drawer-open-leave-from {
	max-height: 300px;
}

.show-backdrop-enter-active,
.show-backdrop-leave-active {
	transition: opacity 0.25s ease;
}

.show-backdrop-enter-from,
.show-backdrop-leave-to {
	opacity: 0;
}

.show-backdrop-enter-to,
.show-backdrop-leave-from {
	opacity: 1;
}
</style>
