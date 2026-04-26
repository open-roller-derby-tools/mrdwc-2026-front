<template>
	<div class="space-y-8 p-8">
		<h1 class="text-3xl font-bold">Channels</h1>

		<div v-if="isDevEnv" class="pt-6">
			<button
				class="px-4 py-2 bg-yellow text-blue-text border-blue-text font-semibold rounded-xl"
				:disabled="performingDelete"
				@click="deleteAllChannels"
			>
				{{ performingDelete ? "Performing delete..." : "Delete all channels" }}
			</button>
			<p v-if="success" class="text-green-400 mt-2">Channels deleted !</p>

			<p v-if="error" class="text-red-400 mt-2">Error : {{ error }}</p>
		</div>
		<!-- Channels list -->
		<div class="space-y-4">
			<h2 class="text-2xl font-bold">Channels list</h2>
			<div
				v-for="c in channels"
				:key="c.id"
				class="bg-gray-900 p-4 rounded flex justify-between items-center"
			>
				<div>
					<p class="text-lg font-semibold">{{ c.name }}</p>
					<p class="text-gray-400 text-sm">{{ c.slug }}</p>
				</div>

				<p class="text-gray-500 text-sm">
					{{ new Date(c.created_at).toLocaleDateString() }}
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
const channels = computed(() => notificationsStore.channels);
const isDevEnv = import.meta.dev;

const performingDelete = ref(false);
const success = ref(false);
const error = ref<string | null>(null);

async function deleteAllChannels() {
	if (!confirm("Delete all channels ?")) return;
	performingDelete.value = true;
	success.value = false;
	error.value = null;

	try {
		await $fetch("/api/channels/all", {
			method: "DELETE",
		});
		// Reload channels and notifications
		notificationsStore.channelsLoaded = false;
		await notificationsStore.fetchChannels();
		notificationsStore.scheduledNotificationsLoaded = false;
	} catch (err: any) {
		error.value = err?.data?.statusMessage ?? "Unknown error";
	} finally {
		performingDelete.value = false;
	}
}

// Get existing channels
await notificationsStore.fetchChannels();
</script>
