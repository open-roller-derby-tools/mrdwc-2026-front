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
				class="hidden sm:flex p-2.5 pt-3 pr-3 items-center justify-center rounded-tr-2xl bg-yellow text-black shadow-omni pointer-events-auto"
				@click="clickTab('all')"
			>
				<UIcon name="ic:round-settings" class="size-6" />
			</button>
			<div
				class="sm:hidden p-3 flex items-center bg-yellow text-black shadow-omni pointer-events-auto"
			>
				<button
					type="button"
					class="flex items-center justify-center flex-1"
					@click="clickTab('no-spoiler-mode')"
				>
					<UIcon name="lucide:eye-off" class="size-6" />
				</button>
				<button
					type="button"
					class="flex items-center justify-center flex-1 border-l border-black/20"
					@click="clickTab('timezone')"
				>
					<UIcon name="ic:round-language" class="size-6" />
				</button>
				<button
					v-if="isDev"
					type="button"
					class="flex items-center justify-center flex-1 border-l border-black/20"
					@click="clickTab('dev-tools')"
				>
					<UIcon name="ic:round-auto-awesome" class="size-6" />
				</button>
			</div>
			<Transition name="drawer-open">
				<div
					v-if="isOpen"
					class="w-full sm:rounded-tr-2xl sm:max-w-md overflow-hidden bg-white text-black pointer-events-auto"
				>
					<div
						class="flex flex-col px-4"
						:class="{ 'pb-4 divide-y divide-blue-text/20': activeTab === 'all' }"
					>
						<div
							v-show="activeTab === 'no-spoiler-mode' || activeTab === 'all'"
							class="py-4 flex items-center justify-between"
						>
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
						<div v-show="activeTab === 'timezone' || activeTab === 'all'" class="py-4">
							<TimezoneSwitcher class="" :with-background="false" />
						</div>
						<div
							v-if="isDev"
							v-show="activeTab === 'dev-tools' || activeTab === 'all'"
							class="py-4"
						>
							<SimulateGamesToggle />
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
import SimulateGamesToggle from "./SimulateGamesToggle.vue";

const { isNoSpoilerModeActive } = useNoSpoilerMode();
const { t } = useI18n();
const { smOrSmaller } = useResponsive();

const activeTab = ref<"no-spoiler-mode" | "timezone" | "notifications" | "dev-tools" | "all">(
	"all"
);
const isOpen = ref(false);
const isDev = import.meta.dev;

const clickTab = (tab: "no-spoiler-mode" | "timezone" | "notifications" | "dev-tools" | "all") => {
	const sameTab = activeTab.value === tab;

	if (!sameTab) {
		activeTab.value = tab;
		if (!isOpen.value) isOpen.value = true;
	}

	if (tab === "all" || sameTab) isOpen.value = !isOpen.value;
};

watch(smOrSmaller, (smOrSmallerNow) => {
	if (smOrSmallerNow) {
		activeTab.value = "no-spoiler-mode";
	} else {
		activeTab.value = "all";
	}
});
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
