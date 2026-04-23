<template>
	<div class="flex justify-between items-center gap-6 p-4 bg-blue-text rounded-lg shadow w-full">
		<span class="text-gray-200">Notifications</span>

		<SubscriptionToggle :model-value="store.notificationsEnabled" @update:model-value="onToggle" />
	</div>
</template>

<script setup lang="ts">
const store = useNotificationsStore();

onMounted(() => {
	void store.loadNotificationsEnabled();
});

function onToggle() {
	void store.toggleNotifications();
}
</script>
