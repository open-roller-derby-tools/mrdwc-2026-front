<template>
	<div class="space-y-8 p-8">
		<h1 class="text-3xl font-bold">Scheduled notifications</h1>

		<div v-if="isDevEnv" class="pt-6">
			<button
				class="px-4 py-2 bg-yellow text-blue-text border-blue-text font-semibold rounded-xl"
				:disabled="performingDelete"
				@click="deleteAllScheduledNotifications"
			>
				{{ performingDelete ? "Performing delete..." : "Delete all Scheduled notifications" }}
			</button>
			<p v-if="success" class="text-green-400 mt-2">Scheduled notifications deleted !</p>

			<p v-if="error" class="text-red-400 mt-2">Error : {{ error }}</p>
		</div>
		<!-- Scheduled notifications list -->
		<div class="space-y-4">
			<h2 class="text-2xl font-bold">Scheduled notifications list</h2>
			<div
				v-for="n in scheduledNotifications"
				:key="n.id"
				class="bg-gray-900 p-4 rounded flex justify-between items-center"
			>
				<div>
					<p class="text-lg font-semibold">{{ n.title }}</p>
					<p class="text-gray-400 text-sm">{{ n.body }}</p>
					<p class="text-gray-400 text-sm">
						{{ n.scheduled_at ? "Scheduled at: " + toLocalString(n.scheduled_at) : "" }}
					</p>
					<p class="text-gray-400 text-sm">
						{{ "Channel id: " + n.channel_id }}
					</p>
				</div>

				<p class="text-gray-500 text-sm">
					{{ new Date(n.created_at).toLocaleDateString() }}
				</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({
	layout: "admin",
});
const notificationsStore = useNotificationsStore();
const scheduledNotifications = computed(() => notificationsStore.scheduledNotifications);
const isDevEnv = import.meta.dev;

const { toLocalString } = useUtcDate();

const performingDelete = ref(false);
const success = ref(false);
const error = ref<string | null>(null);

async function deleteAllScheduledNotifications() {
	if (!confirm("Delete all scheduled notifications ?")) return;
	performingDelete.value = true;
	success.value = false;
	error.value = null;

	try {
		await $fetch("/api/notifications/all-scheduled", {
			method: "DELETE",
		});
		// Reload scheduled notifications list
		notificationsStore.scheduledNotificationsLoaded = false;
		await notificationsStore.fetchScheduledNotifications();
	} catch (err: any) {
		error.value = err?.data?.statusMessage ?? "Unknown error";
	} finally {
		performingDelete.value = false;
	}
}

// Get existing sheduled notifications
await notificationsStore.fetchScheduledNotifications();
</script>
