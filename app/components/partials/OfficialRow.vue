<template>
	<div class="flex items-center gap-2 font-shoulders">
		<div class="min-w-[8ch] text-base">
			<div v-if="currentRole" class="bg-yellow px-1.5 py-0 rounded-md inline-block">
				<Transition
					v-if="hasMultipleRoles"
					mode="out-in"
					enter-active-class="transition-opacity duration-200"
					leave-active-class="transition-opacity duration-200"
					enter-from-class="opacity-0"
					enter-to-class="opacity-100"
					leave-from-class="opacity-100"
					leave-to-class="opacity-0"
				>
					<span :key="currentRole" class="font-bold">{{ formatRole(currentRole) }}</span>
				</Transition>
				<span v-else class="font-bold">{{ formatRole(currentRole) }}</span>
			</div>
		</div>
		<div class="grow text-xl font-medium">{{ official?.name }}</div>
		<div class="w-[3ch] text-center text-base uppercase opacity-50">{{ official?.country }}</div>
	</div>
</template>

<script lang="ts" setup>
import type { IOfficial } from "~~/types/custom";

const props = defineProps<{
	official?: IOfficial;
}>();

const currentRoleIndex = ref(0);

const currentRole = computed(() => {
	const roles = props.official?.roles;
	if (!roles || roles.length === 0) return null;
	return roles[currentRoleIndex.value];
});

const hasMultipleRoles = computed(() => {
	return (props.official?.roles?.length ?? 0) > 1;
});

const formatRole = (role: string) => {
	return role.includes("_") ? role.split("_")[0] : role;
};

let interval: ReturnType<typeof setInterval> | null = null;

const startRoleInterval = () => {
	const roles = props.official?.roles;
	if (!roles || roles.length <= 1) {
		stopRoleInterval();
		return;
	}

	if (interval) return;
	interval = setInterval(() => {
		currentRoleIndex.value = (currentRoleIndex.value + 1) % roles.length;
	}, 2000);
};

const stopRoleInterval = () => {
	if (interval) {
		clearInterval(interval);
		interval = null;
	}
};

watch(
	() => hasMultipleRoles.value,
	(hasMultiple) => {
		if (hasMultiple) startRoleInterval();
		else stopRoleInterval();
	},
	{ immediate: true }
);

watch(
	() => props.official?.id,
	() => {
		currentRoleIndex.value = 0;
	}
);

onUnmounted(() => {
	stopRoleInterval();
});
</script>
