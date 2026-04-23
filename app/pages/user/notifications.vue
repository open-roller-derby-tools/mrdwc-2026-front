<template>
	<div class="maxed padded my-32">
		<h1>Your notifications</h1>

		<ClientOnly>
			<EnableNotificationsToggle />
		</ClientOnly>

		<div class="space-y-4 mt-4">
			<h2>Channels available</h2>

			<div
				v-for="c in notificationStore.channels"
				:key="c.id"
				class="flex items-center justify-between p-4 bg-blue-text rounded-lg shadow"
			>
				<span class="text-gray-200">{{ c.name }}</span>
				<SubscriptionToggle
					:model-value="notificationStore.isSubscribed(c.slug)"
					:disabled="!notificationStore.notificationsEnabled"
					@update:model-value="notificationStore.toggleChannel(c.slug, userId!)"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useNotificationsStore } from "~/stores/notifications";

definePageMeta({
	layout: "default",
});

const { ensureUserExists, userId } = useUser();
const notificationStore = useNotificationsStore();

// Load channels from backend
onMounted(async () => {
	await ensureUserExists();
	if (!userId.value) {
		throw new Error("User ID should never be null after ensureUserExists()");
	}
	await notificationStore.fetchAll(userId.value);
});
</script>
